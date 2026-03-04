import { login, signup, loginGuest } from './actions'

export const runtime = 'edge';

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
    const searchParams = await props.searchParams
    const message = searchParams?.message

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                Comet OS
                            </h1>
                        </div>
                        <h2 className="mt-6 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            Or{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                                request access
                            </a>{' '}
                            if you do not have one.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                                >
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-xl border-0 py-2.5 px-3.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-white dark:ring-zinc-700 dark:focus:ring-indigo-500 transition-all"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                                >
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-xl border-0 py-2.5 px-3.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-white dark:ring-zinc-700 dark:focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                                {message}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <button
                                    formAction={login}
                                    className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                >
                                    Sign in
                                </button>
                                <button
                                    formAction={signup}
                                    formNoValidate
                                    className="flex w-full justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                                >
                                    Sign up
                                </button>

                                <div className="relative mt-2">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-zinc-50 px-2 text-zinc-500 dark:bg-black">Demostración</span>
                                    </div>
                                </div>

                                <button
                                    formAction={loginGuest}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all dark:bg-emerald-500 dark:hover:bg-emerald-400"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <polyline points="16 11 18 13 22 9" />
                                    </svg>
                                    Acceso Invitado
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full object-cover rounded-l-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white shadow-sm backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2" />
                                Beta Preview
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
                                Infrastructure Management Reimagined.
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-indigo-100">
                                Comet OS connects the field to the office in real-time. Track progress, resolve incidents, and manage phases all from a single platform.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-300 border-2 border-indigo-600" />
                                <div className="w-10 h-10 rounded-full bg-purple-300 border-2 border-indigo-600" />
                                <div className="w-10 h-10 rounded-full bg-pink-300 border-2 border-indigo-600" />
                            </div>
                            <div className="text-sm font-medium text-white flex items-center">
                                Trusted by 50+ engineers in Yucatan
                            </div>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                </div>
            </div>
        </div>
    )
}
