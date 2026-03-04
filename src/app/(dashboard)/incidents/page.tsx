import { getIncidents } from "@/lib/services/incidents";
import IncidentsList from "./IncidentsList";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function IncidentsPage() {
    const incidents = await getIncidents();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden-scroll">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Bandeja de Incidentes
                    </h1>
                    <p className="text-zinc-400 mt-2">
                        Gestiona, filtra y resuelve los problemas reportados en campo.
                    </p>
                </div>

                <Link
                    href="/incidents/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-rose-500/20"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">Reportar Incidente</span>
                </Link>
            </div>

            <IncidentsList initialIncidents={incidents} />

        </div>
    );
}
