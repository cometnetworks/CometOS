import { getProjectsWithScores } from '@/lib/services/projects'
import { ProjectCard } from '@/components/dashboard/ProjectCard'

export const revalidate = 0 // Disable cache for MVP so we always see fresh DB changes

export default async function DashboardPage() {
    const projects = await getProjectsWithScores()

    return (
        <div className="mx-auto max-w-7xl">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Resumen de todos tus proyectos, sus estados y métricas clave de calidad e infraestructura.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        className="block rounded-xl bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all cursor-not-allowed opacity-50"
                        disabled
                    >
                        Nuevo Proyecto
                    </button>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="mt-8 text-center rounded-xl border-2 border-dashed border-zinc-200 p-12 dark:border-zinc-800">
                    <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">No hay proyectos</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        No se encontraron proyectos asignados a tu cuenta o tu organización.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            score={project.currentScore}
                            activeIncidents={0} // Fixed to 0 for MVP, can query this later
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
