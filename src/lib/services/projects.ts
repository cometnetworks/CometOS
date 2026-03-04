import { createClient } from '@/lib/supabase/server'

export async function getProjectsWithScores() {
    const supabase = await createClient()

    // Note: Depending on the RLS policies, the user will only see what they are allowed to see
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        return []
    }

    // Fetch the latest score for each project (simplified logic)
    const { data: scores, error: _scoresError } = await supabase
        .from('infra_score_snapshots')
        .select('*')
    // We could group or join, but for MVP let's just get them and match in JS 
    // or use a view. Let's fetch all and match for now as seed data is small.

    const enrichedProjects = projects.map((project) => {
        // get latest score for this project
        const projectScores = scores?.filter(s => s.project_id === project.id) || []
        projectScores.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        const currentScore = projectScores.length > 0 ? projectScores[0].score : undefined

        return {
            ...project,
            currentScore
        }
    })

    return enrichedProjects
}

export async function getProjectsWithPhasesAndSections(): Promise<ProjectDetails[]> {
    const supabase = await createClient()

    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
            *,
            phases (
                *,
                sections (*)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects with phases:', error)
        return []
    }

    return projects as ProjectDetails[]
}

export type ProjectDetails = {
    id: string;
    name: string;
    status: string;
    state: string;
    total_units: number;
    currentScore?: number;
    criticalIncidents: number;
    checklistProgress: number;
    phases: {
        id: string;
        name: string;
        status: string;
        sections: {
            id: string;
            name: string;
            status: string;
            units: number;
        }[];
    }[];
};

export async function getProjectDetails(projectId: string): Promise<ProjectDetails | null> {
    const supabase = await createClient()

    // 1. Fetch project basic data
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (projectError || !project) {
        console.error('Error fetching project:', projectError)
        return null
    }

    // 2. Fetch phases and sections
    const { data: phases, error: phasesError } = await supabase
        .from('phases')
        .select('*, sections(*)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

    if (phasesError) {
        console.error('Error fetching phases:', phasesError)
    }

    // 3. Fetch latest infra score
    const { data: scores, error: _scoresError } = await supabase
        .from('infra_score_snapshots')
        .select('score')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)

    // 4. Fetch critical open incidents (severity = 'Critical' or 'Major', status = 'open' or 'in-progress')
    // and checklist submissions to calculate % completed.
    // Since incidents are tied to sections, we need to filter by section_ids of this project.

    // First, gather all section IDs
    const sectionIds: string[] = [];
    phases?.forEach(p => {
        p.sections?.forEach((s: { id: string }) => sectionIds.push(s.id));
    });

    let criticalIncidentsCount = 0;
    if (sectionIds.length > 0) {
        const { count: incidentsCount, error: incidentsError } = await supabase
            .from('incidents')
            .select('*', { count: 'exact', head: true })
            .in('section_id', sectionIds)
            .in('severity', ['Critical', 'Major'])
            .in('status', ['open', 'in-progress'])

        if (!incidentsError) {
            criticalIncidentsCount = incidentsCount || 0;
        }
    }

    // Calculate checklist completion % (simplified logic for MVP)
    // We could count total expected checklists vs completed
    // Let's assume for now 1 checklist expected per section
    let checkListProgress = 0;
    if (sectionIds.length > 0) {
        const { count: submissionsCount, error: submissionsError } = await supabase
            .from('checklist_submissions')
            .select('*', { count: 'exact', head: true })
            .in('section_id', sectionIds)
            .eq('status', 'completed')

        if (!submissionsError && submissionsCount !== null) {
            checkListProgress = Math.round((submissionsCount / sectionIds.length) * 100);
        }
    }

    return {
        id: project.id,
        name: project.name,
        status: project.status,
        state: project.state,
        total_units: project.total_units,
        currentScore: scores && scores.length > 0 ? scores[0].score : undefined,
        criticalIncidents: criticalIncidentsCount,
        checklistProgress: checkListProgress,
        phases: phases ? phases.map(p => ({
            id: p.id,
            name: p.name,
            status: p.status,
            sections: p.sections ? p.sections.map((s: { id: string, name: string, status: string, units: number }) => ({
                id: s.id,
                name: s.name,
                status: s.status,
                units: s.units
            })) : []
        })) : []
    }
}

