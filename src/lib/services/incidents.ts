import { createClient } from "@/lib/supabase/server";

export type IncidentListDto = {
    id: string;
    description: string;
    severity: string;
    status: string;
    created_at: string;
    sectionName: string;
    projectName: string;
};

export async function getIncidents(): Promise<IncidentListDto[]> {
    const supabase = await createClient();

    // Assuming RLS takes care of returning only what the user can see
    const { data, error } = await supabase
        .from('incidents')
        .select(`
      id,
      description,
      severity,
      status,
      created_at,
      section:section_id(name, phase:phase_id(project:project_id(name)))
    `)
        .order('created_at', { ascending: false });

    if (error || !data) {
        console.error('Error fetching incidents:', error);
        return [];
    }

    return (data as unknown[]).map((row) => {
        const inc = row as {
            id: string;
            description: string;
            severity: string;
            status: string;
            created_at: string;
            section: { name: string; phase: { project: { name: string } | { name: string }[] | null } | null } | null;
        };

        const projectData = inc.section?.phase?.project;
        const projectName = Array.isArray(projectData) ? projectData[0]?.name : projectData?.name;

        return {
            id: inc.id,
            description: inc.description,
            severity: inc.severity,
            status: inc.status,
            created_at: inc.created_at,
            sectionName: inc.section?.name || 'Desconocida',
            projectName: projectName || 'Varios'
        };
    });
}
