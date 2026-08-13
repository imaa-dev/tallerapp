import SubscriptionForm from '@/components/forms/subscriptions/SubscriptionForm';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Plan, Subscription } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Check, CreditCard } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pagos y suscripciones',
        href: '/payments-subscriptions',
    },
];

interface SubscriptionProps {
    subscription: Subscription;
    plans: Plan[];
}

export default function PaymentsAndSubscriptions({ subscription, plans }: SubscriptionProps) {
    const { openModal } = useModal();
    const { props } = usePage();
    const { error } = useToast();
    const flashMessage = (props as any).flash?.message;
    const flashError = (props as any).flash?.error;

    useEffect(() => {
        if (flashError) {
            error(flashError);
        }
    }, [flashError]);

    const statusInfo = {
        trial: {
            label: 'Prueba',
            className: 'text-blue-600',
        },
        pending: {
            label: 'Pendiente',
            className: 'text-yellow-600',
        },
        active: {
            label: 'Activa',
            className: 'text-green-600',
        },
        cancelled: {
            label: 'Cancelada',
            className: 'text-red-600',
        },
        expired: {
            label: 'Expirada',
            className: 'text-yellow-600',
        },
        suspended: {
            label: 'Suspendida',
            className: 'text-black',
        },
    } as const;

    const hasExpired = subscription.status === 'expired';

    const isCurrent = (plan: Plan) => subscription.status === 'active' && plan.id === subscription.plan_id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pagos y subscripciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <div className="mb-8">
                            <div className="mb-6 flex items-center gap-3">
                                <CreditCard className="text-muted-foreground h-6 w-6" />
                                <h1 className="text-2xl font-semibold">Planes y Suscripciones</h1>
                            </div>

                            <p className="text-muted-foreground mt-2">Administra tu suscripción y desbloquea funciones premium.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`bg-card relative rounded-2xl border p-8 shadow-sm ${isCurrent(plan) ? 'border-blue-500' : ''}`}
                                >
                                    {isCurrent(plan) && (
                                        <div className="absolute top-4 right-4 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                                            Plan actual
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-bold">{plan.name}</h2>

                                    {plan.description && <p className="text-muted-foreground mt-2">{plan.description}</p>}

                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">${plan.price.toLocaleString('es-CL')}</span>

                                        <span className="text-muted-foreground">USD/{plan.billing_period === 'year' ? 'año' : 'mes'}</span>
                                    </div>

                                    {plan.plan_features && plan.plan_features.length > 0 && (
                                        <ul className="space-y-3">
                                            {plan.plan_features.map((feature) => (
                                                <li key={feature.key} className="flex items-center gap-2">
                                                    <Check size={18} />
                                                    {feature.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <button
                                        disabled={isCurrent(plan)}
                                        className="mt-8 w-full rounded-lg border px-4 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        onClick={() => openModal(() => <SubscriptionForm plan={plan} />)}
                                    >
                                        {isCurrent(plan) ? 'Plan Actual' : 'Suscribirse'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        {flashMessage && (
                            <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/5 p-6 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-green-700">La suscripción esta siendo procesada</h4>

                                        <p className="text-muted-foreground mt-1 text-sm">{flashMessage}</p>
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

                                    <p className="font-semibold">{subscription.plan.name}</p>
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
                                        <p className="font-semibold text-red-600">La suscripción expiró.</p>
                                    ) : (
                                        <p className="font-semibold">
                                            {subscription.ends_at
                                                ? new Date(subscription.ends_at).toLocaleDateString('es-CL', {
                                                      day: '2-digit',
                                                      month: 'long',
                                                      year: 'numeric',
                                                  })
                                                : 'Sin fecha'}
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
