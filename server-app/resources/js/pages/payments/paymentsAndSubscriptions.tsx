import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Subscription } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Check } from 'lucide-react';
import { useModal } from '@/context/ModalContextForm';
import SubscriptionForm from '@/components/forms/subscriptions/SubscriptionForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pagos y suscripciones',
        href: '/payments-subscriptions'
    }
];

interface SubscriptionProps {
    subscription: Subscription
}

export default function PaymentsAndSubscriptions({subscription}: SubscriptionProps) {
    console.log(subscription)
    const currentPlan = 'free';
    const { openModal } = useModal();
    const { props } = usePage();
    const flashMessage = (props as any).flash?.message;

    const statusInfo = {
        trial: {
            label: "Prueba",
            className: "text-blue-600",
        },
        active: {
            label: "Activa",
            className: "text-green-600",
        },
        cancelled: {
            label: "Cancelada",
            className: "text-red-600",
        },
        expired: {
            label: "Expirada",
            className: "text-yellow-600",
        },
        suspended: {
            label: "Suspendida",
            className: "text-black",
        },
    } as const;
  
    const hasExpired = subscription.status === "expired";
        
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
                        <br></br>
                        {flashMessage && (
                            <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/5 p-6 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-green-700">
                                            La suscripción esta siendo procesada
                                        </h4>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {flashMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* ESTADO DE SUSCRIPCIÓN */}
                        <div className="mt-8 rounded-xl border p-6">
                            <h3 className="mb-4 text-lg font-semibold">Estado de la Suscripción</h3>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-muted-foreground text-sm">Plan actual</p>

                                    <p className="font-semibold"> { subscription.plan.name } </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Estado</p>

                                    <p className={`font-semibold ${statusInfo[subscription.status as keyof typeof statusInfo].className}`}>
                                        {statusInfo[subscription.status as keyof typeof statusInfo].label}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">Próxima renovación</p>

                                    {hasExpired ? (
                                        <p className="font-semibold text-red-600">
                                            La suscripción expiró.
                                        </p>
                                        ) : (
                                        <p className="font-semibold">
                                            {subscription.ends_at
                                            ? new Date(subscription.ends_at).toLocaleDateString("es-CL", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                })
                                            : "Sin fecha"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
