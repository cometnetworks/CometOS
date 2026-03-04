import { getProjectsWithScores } from '@/lib/services/projects'
import { ProjectCard } from '@/components/dashboard/ProjectCard'

export const runtime = 'edge';
export const revalidate = 0

export default async function ProjectsPage() {
    const projects = await getProjectsWithScores()

    return (
        <div className="mx-auto max-w-7xl">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
                        Proyectos
                    </h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Listado completo de proyectos activos y sus métricas de rendimiento.
                    </p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="mt-8 text-center rounded-xl border-2 border-dashed border-zinc-200 p-12 dark:border-zinc-800">
                    <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">No hay proyectos</h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        No se encontraron proyectos en tu organización.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            score={project.currentScore}
                            activeIncidents={0}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
