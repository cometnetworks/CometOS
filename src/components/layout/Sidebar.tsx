'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Home,
    Map,
    ClipboardCheck,
    AlertTriangle,
    Settings,
    LogOut,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Proyectos', href: '/projects', icon: Map },
    { name: 'Checklists', href: '/checklists', icon: ClipboardCheck },
    { name: 'Incidentes', href: '/incidents', icon: AlertTriangle },
    { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="hidden md:flex h-full w-64 flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white px-6 pb-4 dark:border-zinc-800 dark:bg-black">
            <div className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow shadow-indigo-600/20">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-white">Comet OS</span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-indigo-400"
                                    >
                                        <item.icon
                                            aria-hidden="true"
                                            className="h-6 w-6 shrink-0 text-zinc-400 group-hover:text-indigo-600 dark:text-zinc-500 dark:group-hover:text-indigo-400"
                                        />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto">
                        <button
                            onClick={handleSignOut}
                            className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-700 hover:bg-zinc-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-red-400"
                        >
                            <LogOut
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0 text-zinc-400 group-hover:text-red-600 dark:text-zinc-500 dark:group-hover:text-red-400"
                            />
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
