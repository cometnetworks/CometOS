import { getChecklistSubmissionDetails } from "@/lib/services/checklists";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Calendar, Clock, ClipboardCheck, ArrowUpRight } from "@/lib/icons";

export const runtime = 'edge';

export default async function ChecklistDetailPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const detail = await getChecklistSubmissionDetails(params.id);

    if (!detail) {
        notFound();
    }

    // Attempt to parse out coordinates to a map link if they exist
    const hasLocation = detail.evidence?.lat && detail.evidence?.lng;
    const mapUrl = hasLocation && detail.evidence ? `https://www.google.com/maps/search/?api=1&query=${detail.evidence.lat},${detail.evidence.lng}` : null;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden-scroll">

            {/* Header & Back Navigation */}
            <div className="space-y-4">
                <Link
                    href="/checklists"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Volver a la bandeja
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <ClipboardCheck className="w-8 h-8 text-indigo-400" />
                            {detail.template.name}
                        </h1>
                        <p className="text-zinc-400 mt-2 text-lg">
                            {detail.section.phase.project.name} &mdash; {detail.section.phase.name}
                        </p>
                    </div>

                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider self-start ${detail.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                        {detail.status === 'completed' ? 'Completado' : detail.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Meta details */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                        <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                            Detalles
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Sección / Manzana</label>
                                <p className="text-white font-medium mt-1">{detail.section.name}</p>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Tipo validación</label>
                                <p className="text-zinc-300 mt-1 capitalize">{detail.template.type.replace('-', ' ')}</p>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Fecha de envío</label>
                                <div className="flex items-center gap-2 mt-1 text-zinc-300">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    <span>{new Date(detail.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Hora</label>
                                <div className="flex items-center gap-2 mt-1 text-zinc-300">
                                    <Clock className="w-4 h-4 text-zinc-500" />
                                    <span>{new Date(detail.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                            Ubicación
                        </h3>

                        {hasLocation ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-black/20 rounded-xl font-mono text-xs text-zinc-400 break-all leading-relaxed">
                                    Lat: {detail.evidence?.lat}<br />
                                    Lng: {detail.evidence?.lng}
                                </div>
                                <a
                                    href={mapUrl!}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-indigo-300 transition-colors"
                                >
                                    Ver en Google Maps
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>
                        ) : (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400/80 rounded-xl text-sm italic py-8 text-center">
                                Sin datos GPS capturados en este envío.
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Evidence Photo */}
                <div className="col-span-1 md:col-span-2 space-y-4">
                    <h3 className="text-lg font-medium text-white px-2">Evidencia Fotográfica</h3>
                    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
                        {detail.evidence?.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={detail.evidence.image_url}
                                alt="Evidencia de Checklist"
                                className="w-full h-full object-contain bg-black/50"
                            />
                        ) : (
                            <div className="text-center text-zinc-500 p-8">
                                <p>No se subió fotografía de evidencia.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
