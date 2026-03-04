import { getProjectsWithScores } from "@/lib/services/projects";
import IncidentForm from "./IncidentForm";

export default async function NewIncidentPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const initialProjectId = searchParams?.projectId as string | undefined;
    const initialSectionId = searchParams?.sectionId as string | undefined;

    const projects = await getProjectsWithScores();

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden-scroll">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight text-rose-500">Reportar Incidente</h1>
                <p className="text-zinc-400 mt-2">
                    Registra un problema o bloqueo en el campo para que el equipo lo solucione.
                </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
                <IncidentForm
                    projects={projects}
                    initialProjectId={initialProjectId}
                    initialSectionId={initialSectionId}
                />
            </div>
        </div>
    );
}
