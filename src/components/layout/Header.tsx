import { createClient } from '@/lib/supabase/server'
import { Bell } from 'lucide-react'

export async function Header() {
    const supabase = await createClient()

    // For the MVP, we just get the user session
    const { data: { user } } = await supabase.auth.getUser()

    // We can fetch user roles later to show org info
    // const { data: roleData } = await supabase.from('user_roles').select('*').eq('user_id', user?.id).single()

    return (
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-zinc-800 dark:bg-black">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                    <input
                        name="search"
                        type="search"
                        placeholder="Search projects..."
                        aria-label="Search"
                        className="w-full h-full border-0 bg-transparent text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm dark:text-white dark:placeholder:text-zinc-500"
                    />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300">
                        <span className="sr-only">View notifications</span>
                        <Bell aria-hidden="true" className="h-6 w-6" />
                    </button>

                    {/* Separator */}
                    <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" />

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button type="button" className="-m-1.5 flex items-center p-1.5 focus:outline-none">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold dark:bg-indigo-900/50 dark:text-indigo-400">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="hidden lg:flex lg:items-center">
                                <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                                    {user?.email || 'User'}
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
