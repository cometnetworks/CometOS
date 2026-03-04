import { getRecentSubmissions } from "@/lib/services/checklists";
import Link from "next/link";
import { PlusCircle, ClipboardCheck, Clock } from "lucide-react";

export default async function ChecklistsPage() {
    const submissions = await getRecentSubmissions();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden-scroll">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Bandeja de Checklists
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Gestiona y revisa las validaciones en campo de tus proyectos.
                    </p>
                </div>

                <Link
                    href="/checklists/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">Nuevo Envío</span>
                </Link>
            </div>

            {/* Submissions List */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                {submissions.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <ClipboardCheck className="w-12 h-12 text-zinc-500 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">No hay envíos recientes</h3>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            Aún no se han registrado validaciones de checklists. Utiliza el botón superior para crear el primero.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {submissions.map((sub) => (
                            <Link href={`/checklists/${sub.id}`} key={sub.id} className="p-5 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 block">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-indigo-500/10 rounded-xl mt-1">
                                        <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-white">{sub.templateName}</h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-zinc-400">
                                            <span className="font-medium text-zinc-300">{sub.projectName}</span>
                                            <span>•</span>
                                            <span>Manzana: {sub.sectionName}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(sub.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-start md:self-auto">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${sub.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        {sub.status === 'completed' ? 'Completado' : sub.status}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
