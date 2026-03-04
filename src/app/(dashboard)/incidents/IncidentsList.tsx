"use client";

import { useState, useTransition } from "react";
import { resolveIncident } from "./actions";
import { IncidentListDto } from "@/lib/services/incidents";
import { AlertTriangle, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react";

export default function IncidentsList({ initialIncidents }: { initialIncidents: IncidentListDto[] }) {
    const [incidents, setIncidents] = useState(initialIncidents);
    const [filterSeverity, setFilterSeverity] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isPending, startTransition] = useTransition();

    const handleResolve = (id: string) => {
        startTransition(async () => {
            await resolveIncident(id);
            // Optimistically update the UI
            setIncidents(prev => prev.map(inc =>
                inc.id === id ? { ...inc, status: "resolved" } : inc
            ));
        });
    };

    const filteredIncidents = incidents.filter(inc => {
        if (filterSeverity !== "All" && inc.severity !== filterSeverity) return false;
        if (filterStatus !== "All" && inc.status !== filterStatus) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <select
                    value={filterSeverity}
                    onChange={e => setFilterSeverity(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="All" className="bg-zinc-900">Todas las Severidades</option>
                    <option value="Critical" className="bg-zinc-900 text-rose-400">Crítico</option>
                    <option value="Major" className="bg-zinc-900 text-amber-400">Mayor</option>
                    <option value="Minor" className="bg-zinc-900 text-zinc-300">Menor</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="All" className="bg-zinc-900">Todos los Estados</option>
                    <option value="open" className="bg-zinc-900">Abierto</option>
                    <option value="in-progress" className="bg-zinc-900">En Progreso</option>
                    <option value="resolved" className="bg-zinc-900">Resuelto</option>
                </select>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredIncidents.length === 0 ? (
                    <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
                        <AlertTriangle className="w-10 h-10 text-zinc-500 mx-auto mb-3 opacity-50" />
                        <p className="text-zinc-400">No se encontraron incidentes con los filtros actuales.</p>
                    </div>
                ) : (
                    filteredIncidents.map(inc => (
                        <div key={inc.id} className="p-5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between">

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${inc.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                                            inc.severity === 'Major' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                'bg-slate-500/20 text-slate-300 border border-slate-500/20'
                                        }`}>
                                        {inc.severity}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' :
                                            'bg-zinc-500/10 text-zinc-400'
                                        }`}>
                                        {inc.status}
                                    </span>
                                </div>

                                <h4 className="text-white font-medium text-lg leading-snug">
                                    {inc.description}
                                </h4>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {inc.projectName} - {inc.sectionName}
                                    </span>
                                    <span className="flex items-center gap-1.5 opacity-80">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(inc.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center shrink-0">
                                {inc.status !== 'resolved' ? (
                                    <button
                                        onClick={() => handleResolve(inc.id)}
                                        disabled={isPending}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-xl transition-colors border border-emerald-500/20 disabled:opacity-50"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Resolver Incidente
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 border border-emerald-500/10 text-emerald-500/50 font-medium rounded-xl">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Resuelto
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
