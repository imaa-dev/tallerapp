import api from '@/api/AxiosIntance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLoading } from '@/context/LoadingContext';
import { Plan } from '@/types';
import { Crown, Landmark, Wallet } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionFormProps {
    plan: Plan;
}

export default function SubscriptionForm({ plan }: SubscriptionFormProps) {
    const [paymentMethod, setPaymentMethod] = useState('paypal');
    const { showLoading, hideLoading } = useLoading();

    const paymentMethods = [
        {
            id: 'paypal',
            name: 'PayPal',
            icon: Wallet,
        },
        {
            id: 'mercadoPago',
            name: 'Mercado Pago',
            icon: Landmark,
        },
    ];

    const subscribe = async () => {
        showLoading();

        try {
            const res = await api.post('/subscribe/create', {
                plan_id: plan.id,
                provider: paymentMethod,
            });

            const approveUrl = res.data.data.approve_url;
            window.location.href = approveUrl;
        } finally {
            hideLoading();
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
                <div className="mb-3 flex items-center gap-3">
                    <Crown size={28} />
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                </div>

                <p className="text-gray-600">{plan.description || 'Desbloquea todas las funcionalidades avanzadas de la plataforma.'}</p>

                <div className="my-4">
                    <span className="text-4xl font-bold">${plan.price.toLocaleString('es-CL')}</span>

                    <span className="ml-2 text-gray-500">USD/{plan.billing_period === 'year' ? 'año' : 'mes'}</span>
                </div>

                {plan.plan_features && plan.plan_features.length > 0 && (
                    <div className="mt-4">
                        <h4 className="mb-3 font-semibold">Beneficios incluidos</h4>

                        <ul className="space-y-2">
                            {plan.plan_features.map((feature) => (
                                <li key={feature.key}>✓ {feature.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>

            <Card className="p-6">
                <h3 className="text-xl font-semibold">Resumen de compra</h3>

                <div className="mt-4 space-y-4">
                    <div className="flex justify-between">
                        <span>Plan</span>
                        <span>{plan.name}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Periodo</span>
                        <span>{plan.billing_period === 'year' ? 'Anual' : 'Mensual'}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Método</span>
                        <span>{paymentMethods.find((m) => m.id === paymentMethod)?.name ?? paymentMethod}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${plan.price.toLocaleString('es-CL')} USD</span>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="mb-4 font-semibold">Selecciona un método de pago</h4>

                    <div className="space-y-3">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;

                            return (
                                <Card
                                    key={method.id}
                                    className={`cursor-pointer transition ${paymentMethod === method.id ? 'border-blue-500' : ''}`}
                                    onClick={() => setPaymentMethod(method.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span>{method.name}</span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <Button className="mt-6 w-full" onClick={subscribe}>
                    Pagar con {paymentMethods.find((m) => m.id === paymentMethod)?.name ?? paymentMethod}
                </Button>
            </Card>
        </div>
    );
}
