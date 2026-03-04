import { createClient } from "@/lib/supabase/server";

export type ChecklistTemplate = {
    id: string;
    name: string;
    type: string;
    items: {
        id: string;
        label: string;
        required: boolean;
    }[];
}

export async function getChecklistTemplates(): Promise<ChecklistTemplate[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('checklist_templates')
        .select('*, items:checklist_items!inner(*)');

    if (error) {
        console.error('Error fetching checklist templates:', error);
        return [];
    }

    // Typecasting mapped items
    return (data as unknown[]).map((row) => {
        const t = row as { id: string; name: string; type: string; items: unknown };
        return {
            id: t.id,
            name: t.name,
            type: t.type,
            items: Array.isArray(t.items)
                ? t.items.map(item => {
                    const i = item as { id: string; label: string; required: boolean };
                    return { id: i.id, label: i.label, required: i.required };
                })
                : []
        };
    });
}

export type ChecklistSubmissionSummary = {
    id: string;
    status: string;
    created_at: string;
    templateName: string;
    sectionName: string;
    projectName: string;
}

export async function getRecentSubmissions(): Promise<ChecklistSubmissionSummary[]> {
    const supabase = await createClient();

    // Assuming RLS takes care of returning only what the user can see
    const { data, error } = await supabase
        .from('checklist_submissions')
        .select(`
      id,
      status,
      created_at,
      template:template_id(name),
      section:section_id(name, phase:phase_id(project:project_id(name)))
    `)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error || !data) {
        console.error('Error fetching submissions:', error);
        return [];
    }

    return (data as unknown[]).map((row) => {
        const sub = row as {
            id: string;
            status: string;
            created_at: string;
            template: { name: string } | null;
            section: { name: string; phase: { project: { name: string } | { name: string }[] | null } | null } | null;
        };

        const projectData = sub.section?.phase?.project;
        const projectName = Array.isArray(projectData) ? projectData[0]?.name : projectData?.name;

        return {
            id: sub.id,
            status: sub.status,
            created_at: sub.created_at,
            templateName: sub.template?.name || 'Desconocido',
            sectionName: sub.section?.name || 'Desconocida',
            projectName: projectName || 'Varios'
        };
    });
}

export type ChecklistSubmissionDetails = {
    id: string;
    status: string;
    created_at: string;
    template: {
        name: string;
        type: string;
    };
    section: {
        name: string;
        phase: {
            name: string;
            project: {
                name: string;
            }
        }
    };
    evidence: {
        id: string;
        image_url: string;
        lat: number | null;
        lng: number | null;
        created_at: string;
    } | null;
}

export async function getChecklistSubmissionDetails(id: string): Promise<ChecklistSubmissionDetails | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('checklist_submissions')
        .select(`
            id,
            status,
            created_at,
            template:template_id(name, type),
            section:section_id(name, phase:phase_id(name, project:project_id(name))),
            checklist_evidence(id, image_url, lat, lng, created_at)
        `)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching submission details:', error);
        return null;
    }

    const sub = data as unknown as {
        id: string;
        status: string;
        created_at: string;
        template: { name: string; type: string } | null;
        section: { name: string; phase: { name: string; project: { name: string } | { name: string }[] | null } | null } | null;
        checklist_evidence: { id: string; image_url: string; lat: number; lng: number; created_at: string }[] | null;
    };

    const projectData = sub.section?.phase?.project;
    const projectArray = Array.isArray(projectData) ? projectData[0] : projectData;

    return {
        id: sub.id,
        status: sub.status,
        created_at: sub.created_at,
        template: {
            name: sub.template?.name || 'Desconocida',
            type: sub.template?.type || 'N/A'
        },
        section: {
            name: sub.section?.name || 'Desconocida',
            phase: {
                name: sub.section?.phase?.name || 'Fase Desconocida',
                project: {
                    name: projectArray?.name || 'Proyecto Desconocido'
                }
            }
        },
        evidence: sub.checklist_evidence && sub.checklist_evidence.length > 0
            ? sub.checklist_evidence[0]
            : null
    };
}
