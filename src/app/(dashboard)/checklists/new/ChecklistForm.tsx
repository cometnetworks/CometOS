"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { ChecklistTemplate } from "@/lib/services/checklists";
import { ProjectDetails } from "@/lib/services/projects";
import { submitChecklist } from "../actions";
import { Camera, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type ChecklistFormProps = {
    templates: ChecklistTemplate[];
    projects: ProjectDetails[];
    initialProjectId?: string;
    initialSectionId?: string;
};

export default function ChecklistForm({
    templates,
    projects,
    initialProjectId,
    initialSectionId
}: ChecklistFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    // Form selections
    const [projectId, setProjectId] = useState(initialProjectId || "");
    const [sectionId, setSectionId] = useState(initialSectionId || "");
    const [templateId, setTemplateId] = useState("");

    // Location state
    const [locationError, setLocationError] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [locationStatus, setLocationStatus] = useState<"pending" | "acquired" | "missing">("pending");

    // Image state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Derived state
    const selectedProject = projects.find(p => p.id === projectId);

    // Flatten all sections from all phases for the selected project
    const availableSections = selectedProject?.phases?.flatMap(p => p.sections) || [];

    const selectedTemplate = templates.find(t => t.id === templateId);

    const fetchLocation = () => {
        setLocationStatus("pending");
        setLocationError("");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                    setLocationStatus("acquired");
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    let errMsg = "Error al obtener ubicación.";
                    if (error.code === error.PERMISSION_DENIED) errMsg = "Permiso GPS denegado. Revisa tus ajustes.";
                    else if (error.code === error.POSITION_UNAVAILABLE) errMsg = "Señal GPS no disponible.";
                    else if (error.code === error.TIMEOUT) errMsg = "Tiempo de espera agotado.";

                    setLocationError(errMsg);
                    setLocationStatus("missing");
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        } else {
            setLocationError("Navegador no soporta GPS.");
            setLocationStatus("missing");
        }
    };

    useEffect(() => {
        // Attempt to get location automatically on mount
        fetchLocation();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleFormSubmit = async (formData: FormData) => {
        setError(null);

        // 1. Manual Validation before sending (to avoid silent HTML5 fails)
        if (!projectId) return setError("Por favor, selecciona un proyecto.");
        if (!sectionId) return setError("Por favor, selecciona una sección/manzana.");
        if (!templateId) return setError("Por favor, selecciona una plantilla.");
        if (!imagePreview) return setError("La foto de evidencia es obligatoria.");

        // Check required checklist items
        if (selectedTemplate) {
            const missingRequired = selectedTemplate.items.find(
                item => item.required && !formData.get(`item_${item.id}`)
            );
            if (missingRequired) {
                return setError(`Falta marcar un campo obligatorio: "${missingRequired.label}"`);
            }
        }

        // Inject manual/auto location status
        if (lat) formData.append("lat", lat.toString());
        if (lng) formData.append("lng", lng.toString());
        formData.append("locationStatus", locationStatus);

        // Force controlled React states into FormData
        formData.set("projectId", projectId);
        formData.set("sectionId", sectionId);
        formData.set("templateId", templateId);

        startTransition(async () => {
            try {
                const result = await submitChecklist(formData);
                if (result?.success) {
                    router.push('/checklists');
                }
            } catch (err: unknown) {
                console.error("Client side form submission error:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error devuelto por la base de datos.");
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    };

    return (
        <form action={handleFormSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* 1. Context Selection */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">1. Contexto</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="projectId" className="text-sm font-medium text-zinc-400">Proyecto</label>
                        <select
                            id="projectId"
                            name="projectId"
                            value={projectId}
                            onChange={(e) => {
                                setProjectId(e.target.value);
                                setSectionId(""); // Reset section when project changes
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                            disabled={!projectId}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
                        >
                            <option value="" disabled className="bg-zinc-900 text-zinc-400">Selecciona una sección</option>
                            {availableSections.map((s: { id: string, name: string }) => (
                                <option key={s.id} value={s.id} className="bg-zinc-900 text-white">{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <label htmlFor="templateId" className="text-sm font-medium text-zinc-400">Plantilla de Validación</label>
                    <select
                        id="templateId"
                        name="templateId"
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                        <option value="" disabled className="bg-zinc-900 text-zinc-400">Selecciona una plantilla</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id} className="bg-zinc-900 text-white">{t.name} ({t.type})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 2. Checklist Items */}
            {selectedTemplate && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">2. Puntos de Control</h3>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                        {selectedTemplate.items.map((item) => (
                            <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-start pt-0.5">
                                    <input
                                        type="checkbox"
                                        name={`item_${item.id}`}
                                        value="true"
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-200 group-hover:text-white transition-colors">{item.label}</span>
                                    {item.required && <span className="text-xs text-rose-400 mt-0.5">* Requerido</span>}
                                </div>
                            </label>
                        ))}
                        {selectedTemplate.items.length === 0 && (
                            <p className="text-sm text-zinc-500 italic">No hay puntos de control en esta plantilla.</p>
                        )}
                    </div>
                </div>
            )}

            {/* 3. Evidencias (Foto & Geo) */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">3. Evidencia</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cámara */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-400 block">Fotografía en Terreno</label>
                        <div
                            className={`relative border-2 border-dashed ${imagePreview ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/20 hover:border-white/40 bg-white/5'} rounded-2xl overflow-hidden transition-all aspect-video flex flex-col items-center justify-center cursor-pointer`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                name="evidence"
                                accept="image/*"
                                capture="environment" /* Native camera trigger on mobile */
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            {imagePreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-zinc-500 p-6 text-center">
                                    <Camera className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-sm font-medium text-zinc-400">Tocar para tomar foto</span>
                                    <span className="text-xs mt-1">Obligatorio</span>
                                </div>
                            )}
                        </div>
                        {imagePreview && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                            >
                                Eliminar foto
                            </button>
                        )}
                    </div>

                    {/* Geolocalización */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-400 block">Ubicación GPS</label>
                        <div className={`p-4 rounded-2xl border ${locationStatus === 'acquired' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'} h-[calc(100%-2rem)] flex flex-col justify-center`}>
                            {locationStatus === 'pending' && (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-3 py-6">
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                                    <span className="text-sm">Obteniendo coordenadas...</span>
                                </div>
                            )}
                            {locationStatus === 'acquired' && (
                                <div className="flex flex-col items-center justify-center h-full text-emerald-400 space-y-2 py-6">
                                    <div className="p-3 bg-emerald-500/20 rounded-full">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-medium">Ubicación Capturada</span>
                                    <span className="text-xs font-mono opacity-70">Lat: {lat?.toFixed(6)}, Lng: {lng?.toFixed(6)}</span>
                                </div>
                            )}
                            {locationStatus === 'missing' && (
                                <div className="flex flex-col items-center justify-center h-full text-amber-400 space-y-3 py-6 text-center px-4">
                                    <AlertCircle className="w-6 h-6 opacity-70" />
                                    <div>
                                        <span className="text-sm font-medium block">Sin ubicación GPS</span>
                                        <span className="text-xs opacity-80 mt-1 block">{locationError}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchLocation}
                                        className="mt-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        Reintentar GPS
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
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
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPending || !projectId || !sectionId || !templateId || !imagePreview}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>Enviar Validación</>
                    )}
                </button>
            </div>

        </form>
    );
}
