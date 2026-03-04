import Link from "next/link";
import { PlusCircle, AlertTriangle } from "@/lib/icons";
import { ProjectDetails } from "@/lib/services/projects";

type PhaseListProps = {
    project: ProjectDetails;
};

export default function PhaseList({ project }: PhaseListProps) {
    if (!project.phases || project.phases.length === 0) {
        return (
            <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-zinc-400">No hay fases configuradas para este proyecto.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {project.phases.map((phase) => (
                <div key={phase.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">{phase.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-zinc-300">
                            {phase.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {phase.sections && phase.sections.length > 0 ? (
                            phase.sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-500/50 transition-colors flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-lg font-medium text-white">{section.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${section.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                section.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400' :
                                                    'bg-zinc-500/10 text-zinc-400'
                                                }`}>
                                                {section.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-6">{section.units} Unidades</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/checklists/new?projectId=${project.id}&sectionId=${section.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            Checklist
                                        </Link>
                                        <Link
                                            href={`/incidents/new?projectId=${project.id}&sectionId=${section.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-xl transition-colors border border-rose-500/20"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Incidente
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-500">
                                No hay manzanas (secciones) en esta fase.
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
