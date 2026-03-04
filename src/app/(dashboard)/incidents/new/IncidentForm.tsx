"use client";

import { useState, useTransition } from "react";
import { ProjectDetails } from "@/lib/services/projects";
import { createIncident } from "../actions";
import { Loader2, AlertCircle } from "@/lib/icons";
import { useRouter } from "next/navigation";

export default function IncidentForm({
    projects,
    initialProjectId,
    initialSectionId
}: {
    projects: ProjectDetails[];
    initialProjectId?: string;
    initialSectionId?: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [projectId, setProjectId] = useState(initialProjectId || "");
    const [sectionId, setSectionId] = useState(initialSectionId || "");
    const [severity, setSeverity] = useState("Minor");
    const [description, setDescription] = useState("");

    const selectedProject = projects.find(p => p.id === projectId);
    const availableSections = selectedProject?.phases.flatMap(p => p.sections) || [];

    const handleSubmit = (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            try {
                const result = await createIncident(formData);
                if (result?.success) {
                    router.push('/incidents');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error al registrar el incidente");
                }
            }
        });
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="projectId" className="text-sm font-medium text-zinc-400">Proyecto</label>
                    <select
                        id="projectId"
                        name="projectId"
                        value={projectId}
                        onChange={(e) => {
                            setProjectId(e.target.value);
                            setSectionId("");
                        }}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="" disabled className="bg-zinc-900 text-zinc-400">Selecciona un proyecto</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id} className="bg-zinc-900 text-white">{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="sectionId" className="text-sm font-medium text-zinc-400">Manzana / Sección</label>
                    <select
                        id="sectionId"
                        name="sectionId"
                        value={sectionId}
                        onChange={(e) => setSectionId(e.target.value)}
                        required
                        disabled={!projectId}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
                    >
                        <option value="" disabled className="bg-zinc-900 text-zinc-400">Selecciona una sección</option>
                        {availableSections.map((s: { id: string, name: string }) => (
                            <option key={s.id} value={s.id} className="bg-zinc-900 text-white">{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="severity" className="text-sm font-medium text-zinc-400">Severidad</label>
                <select
                    id="severity"
                    name="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    required
                    className="w-full max-w-xs bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                    <option value="Minor" className="bg-zinc-900 text-white">Menor</option>
                    <option value="Major" className="bg-zinc-900 text-amber-400">Mayor</option>
                    <option value="Critical" className="bg-zinc-900 text-rose-400">Crítico</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-zinc-400">Descripción del Problema</label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe detalladamente el bloqueo o problema encontrado..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 rounded-xl font-medium text-zinc-300 hover:bg-white/5 transition-colors"
                    disabled={isPending}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 focus:ring-4 focus:ring-rose-500/20 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPending || !projectId || !sectionId || !description}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>Reportar Incidente</>
                    )}
                </button>
            </div>
        </form>
    );
}
