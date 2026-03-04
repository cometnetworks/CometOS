import { Settings as SettingsIcon, User, Bell, Shield, Cloud } from '@/lib/icons'

export const runtime = 'edge';

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-7xl">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
                        Configuración
                    </h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Administra las preferencias de tu cuenta y de la plataforma.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Perfil */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Perfil de Usuario</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Información personal y de contacto</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 uppercase dark:text-zinc-400">Nombre</label>
                            <p className="mt-1 text-sm text-zinc-900 dark:text-white">Usuario Demo</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 uppercase dark:text-zinc-400">Email</label>
                            <p className="mt-1 text-sm text-zinc-900 dark:text-white">demo@cometnetworks.com</p>
                        </div>
                    </div>
                </div>

                {/* Notificaciones */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-xl bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                            <Bell className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Notificaciones</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Alertas de incidentes y checklists</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm text-zinc-500">
                        <p>Las notificaciones se envían por correo electrónico cuando se detectan incidentes críticos.</p>
                    </div>
                </div>

                {/* Seguridad */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Seguridad</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Contraseña y autenticación</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm text-zinc-500">
                        <p>La autenticación está gestionada por Supabase Auth.</p>
                    </div>
                </div>

                {/* Cloud/Infra */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <Cloud className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Infraestructura</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Conexiones y proveedores cloud</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-sm text-zinc-500">
                        <p>Actualmente conectado a Supabase y Netlify.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
