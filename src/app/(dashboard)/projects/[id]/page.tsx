import { getProjectDetails } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import PhaseList from "@/components/projects/PhaseList";
import { Activity, AlertOctagon, CheckSquare, MapPin } from "lucide-react";
import Link from "next/link";

export const runtime = 'edge';

export default async function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Await the params object matching Next.js 15 route requirements
    const { id } = await params;

    const project = await getProjectDetails(id);

    if (!project) {
        notFound();
    }

    // Calculate v0.1 Infra Score Badge
    let infraScoreBadge = { label: "Saludable", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };

    const isBlocked = project.phases?.some(p => p.sections?.some(s => s.status === 'blocked'));

    if (project.criticalIncidents > 0) {
        infraScoreBadge = { label: "Riesgo Alto", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
    } else if (isBlocked) {
        infraScoreBadge = { label: "Bloqueado", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    } else if (project.checklistProgress < 100 && project.status === 'active') {
        infraScoreBadge = { label: "Pendiente", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden-scroll">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Proyectos
                        </Link>
                        <span className="text-zinc-600">/</span>
                        <span className="text-sm font-medium text-indigo-400">{project.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        {project.name}
                        <span className={`px-3 py-1 text-sm rounded-full border ${infraScoreBadge.color}`}>
                            {infraScoreBadge.label}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 mt-3 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {project.state}
                        </span>
                        <span>•</span>
                        <span>{project.total_units} Unidades Totales</span>
                        <span>•</span>
                        <span className="capitalize">{project.status}</span>
                    </div>
                </div>
            </div>

            {/* Executive Metrics (3 Blocks) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-indigo-500/20">
                            <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-zinc-400 font-medium">Infra Score Actual</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                            {project.currentScore !== undefined ? project.currentScore : "N/A"}
                        </span>
                        {project.currentScore !== undefined && <span className="text-zinc-500 font-medium">/ 100</span>}
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-orange-500/20">
                            <CheckSquare className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-zinc-400 font-medium">Avance Checklists</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                            {project.checklistProgress}%
                        </span>
                    </div>
                    {/* Visual progress bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                        <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${project.checklistProgress}%` }}
                        />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-rose-500/20">
                            <AlertOctagon className="w-5 h-5 text-rose-400" />
                        </div>
                        <h3 className="text-zinc-400 font-medium">Incidentes Críticos</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                            {project.criticalIncidents}
                        </span>
                        <span className="text-zinc-500 font-medium pb-1">Abiertos</span>
                    </div>
                </div>
            </div>

            {/* Phase List */}
            <div className="pt-4">
                <h2 className="text-2xl font-bold text-white mb-6">Fases y Manzanas</h2>
                <PhaseList project={project} />
            </div>

        </div>
    );
}
