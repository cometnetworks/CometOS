import { getChecklistTemplates } from "@/lib/services/checklists";
import { getProjectsWithPhasesAndSections } from "@/lib/services/projects";
import ChecklistForm from "./ChecklistForm";

export default async function NewChecklistPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const initialProjectId = searchParams?.projectId as string | undefined;
    const initialSectionId = searchParams?.sectionId as string | undefined;

    // Need to fetch templates and projects for the dropdowns
    const templates = await getChecklistTemplates();
    const projects = await getProjectsWithPhasesAndSections();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden-scroll">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Nuevo Checklist</h1>
                <p className="text-zinc-400 mt-2">
                    Completa la validación en campo adjuntando evidencia fotográfica y ubicación.
                </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
                <ChecklistForm
                    templates={templates}
                    projects={projects}
                    initialProjectId={initialProjectId}
                    initialSectionId={initialSectionId}
                />
            </div>
        </div>
    );
}
