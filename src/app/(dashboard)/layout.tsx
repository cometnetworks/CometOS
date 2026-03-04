import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden pb-16 md:pb-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
            <MobileNav />
        </div>
    )
}
