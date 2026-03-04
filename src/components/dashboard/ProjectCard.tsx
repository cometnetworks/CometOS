import Link from 'next/link'
import { MapPin, TrendingUp, AlertCircle, CheckCircle2 } from '@/lib/icons'

interface ProjectCardProps {
    project: {
        id: string
        name: string
        state: string
        total_units: number
        status: string
    }
    score?: number
    activeIncidents?: number
}

export function ProjectCard({ project, score, activeIncidents = 0 }: ProjectCardProps) {
    // Demo score coloring
    const getScoreColor = (scoreNum?: number) => {
        if (scoreNum === undefined) return 'text-zinc-400 dark:text-zinc-500'
        if (scoreNum >= 90) return 'text-emerald-500 dark:text-emerald-400'
        if (scoreNum >= 75) return 'text-amber-500 dark:text-amber-400'
        return 'text-red-500 dark:text-red-400'
    }

    const scoreColor = getScoreColor(score)

    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                            {project.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-6 text-zinc-900 dark:text-white">
                        <Link href={`/projects/${project.id}`}>
                            <span className="absolute inset-0" />
                            {project.name}
                        </Link>
                    </h3>
                    <p className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                        <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
                        {project.state}
                    </p>
                </div>

                {/* Infra Score */}
                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Infra Score</span>
                    <div className={`mt-1 flex items-baseline gap-1 ${scoreColor}`}>
                        <span className="text-3xl font-bold tracking-tight">{score || '--'}</span>
                        {score && <TrendingUp className="h-4 w-4" />}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{project.total_units}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">Units</span>
                </div>

                {activeIncidents > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{activeIncidents}</span>
                        <span className="text-zinc-500 dark:text-zinc-400">Incidents</span>
                    </div>
                )}
            </div>
        </div>
    )
}
