import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Check } from 'lucide-react';
import { useModal } from '@/context/ModalContextForm';
import SubscriptionForm from '@/components/forms/subscriptions/SubscriptionForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pagos y suscripciones',
        href: '/payments-subscriptions'
    }
];

export default function PaymentsAndSubscriptions() {
    const currentPlan = 'free';
    const { openModal } = useModal();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pagos y subscripciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">

                    <div className="mx-auto w-full max-w-6xl p-4">
                        <div className="mb-8">
                            <h1 className="mb-6 text-2xl font-semibold">Planes y Suscripciones</h1>

                            <p className="text-muted-foreground mt-2">Administra tu suscripción y desbloquea funciones premium.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* PLAN FREE */}
                            <div className="bg-card rounded-2xl border p-8 shadow-sm">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold">Free</h2>

                                    <p className="text-muted-foreground mt-2">Ideal para comenzar.</p>

                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">$0</span>

                                        <span className="text-muted-foreground">/mes</span>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Gestión básica
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Hasta 10 registros
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Soporte comunitario
                                    </li>
                                </ul>

                                <button
                                    disabled={currentPlan === 'free'}
                                    className="mt-8 w-full rounded-lg border px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {currentPlan === 'free' ? 'Plan Actual' : 'Seleccionar'}
                                </button>
                            </div>

                            {/* PLAN PREMIUM */}
                            <div className="bg-card relative rounded-2xl border-2 border-blue-500 p-8 shadow-lg">
                                <div className="absolute top-4 right-4 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">Recomendado</div>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold">Premium</h2>

                                    <p className="text-muted-foreground mt-2">Todas las funciones sin límites.</p>

                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">$5</span>

                                        <span className="text-muted-foreground">USD/mes</span>
                                    </div>

                                    <p className="text-muted-foreground mt-2 text-sm">Renovación automática mensual.</p>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Registros ilimitados
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Estadísticas avanzadas
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Exportación de datos
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <Check size={18} />
                                        Soporte prioritario
                                    </li>
                                </ul>

                                <button
                                    className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                                    onClick={() => openModal(() => (<SubscriptionForm />))}
                                >
                                    Suscribirse por $5 USD/mes
                                </button>
                            </div>
                        </div>

                        {/* ESTADO DE SUSCRIPCIÓN */}
                        <div className="mt-8 rounded-xl border p-6">
                            <h3 className="mb-4 text-lg font-semibold">Estado de la Suscripción</h3>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-muted-foreground text-sm">Plan actual</p>

                                    <p className="font-semibold">Free</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground text-sm">Estado</p>

                                    <p className="font-semibold text-green-600">Activo</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground text-sm">Próxima renovación</p>

                                    <p className="font-semibold">-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
