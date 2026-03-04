'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, ClipboardCheck, AlertTriangle, Settings } from 'lucide-react'

const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Proyectos', href: '/projects', icon: Map },
    { name: 'Checklists', href: '/checklists', icon: ClipboardCheck },
    { name: 'Incidentes', href: '/incidents', icon: AlertTriangle },
    { name: 'Ajustes', href: '/settings', icon: Settings },
]

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 pb-safe">
            <nav className="flex justify-around items-center h-16">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${isActive ? 'fill-indigo-600/20 dark:fill-indigo-400/20' : ''}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
