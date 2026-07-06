import { router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CreditCard, Crown, Landmark, Wallet } from 'lucide-react';
import { useState } from 'react';
import api from '@/api/AxiosIntance';
import { useLoading } from '@/context/LoadingContext';

export default function PremiumSubscription() {
    const [paymentMethod, setPaymentMethod] = useState('webpay');
    const { showLoading, hideLoading } = useLoading();
    const plan = {
        name: 'Premium',
        price: 5,
        currency: 'US',
    };

    const paymentMethods = [
    //     {
    //         id: 'webpay',
    //         name: 'WebPay',
    //         icon: Wallet,
    //     },
    //     {
    //         id: 'card',
    //         name: 'Tarjeta Crédito/Débito',
    //         icon: CreditCard,
    //     },
        {
            id: 'paypal',
            name: 'PayPal',
            icon: Wallet,
        },
        // {
        //     id: 'transfer',
        //     name: 'Transferencia',
        //     icon: Landmark,
        // },
    ];

    const handleCheckout = () => {
        if(paymentMethod === 'paypal'){
            console.log("Generar pago con paypal")
        }
    };
    const subscribe = async () => {
        showLoading()
        const res = await api.post("/paypal/subscriptions/create", {
            plan_id: "P-3VR314122F700191NNJDOVKQ",
        });

        const approveUrl = res.data.data.approve_url;
        hideLoading()
        window.location.href = approveUrl;
    };
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Información del plan */}
            <Card className="lg:col-span-2">
                <div className="ml-3 flex items-center gap-3">
                    <Crown size={28} />
                    <h2 className="text-2xl font-bold">Plan Premium</h2>
                </div>

                <p className="ml-3 mr-3 text-gray-600">Desbloquea todas las funcionalidades avanzadas de la plataforma.</p>

                <div className="my-4 ml-3">
                    <span className="text-4xl font-bold">${plan.price.toLocaleString('es-CL')}</span>

                    <span className="ml-2 text-gray-500">/ mes</span>
                </div>

                <div className="ml-3">
                    <h4 className="mb-3 font-semibold">Beneficios incluidos</h4>

                    <ul className="space-y-2">
                        <li>✓ Acceso ilimitado</li>
                        <li>✓ Estadísticas avanzadas</li>
                        <li>✓ Soporte prioritario</li>
                        <li>✓ Actualizaciones futuras</li>
                    </ul>
                </div>

                <div className="mt-6 mr-3 ml-3">
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
            </Card>

            {/* Resumen */}
            <Card>
                <h3 className="ml-3 text-xl font-semibold">Resumen de compra</h3>

                <div className="mr-3 ml-3 space-y-4">
                    <div className="flex justify-between">
                        <span>Plan</span>
                        <span>Premium</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Periodo</span>
                        <span>Mensual</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Método</span>
                        <span>{paymentMethod}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>

                        <span>${plan.price.toLocaleString('es-CL')}</span>
                    </div>
                </div>
                {paymentMethod === 'paypal' ? (
                    <Button className="m-3 mt-6" onClick={subscribe}>
                        Pagar con paypal
                    </Button>
                ) : (
                    <Button className="m-3 mt-6" onClick={handleCheckout}>
                        Continuar al pago
                    </Button>
                )}
            </Card>
        </div>
    );
}

// email sandbox person 
// sb-vzbjj51917868@personal.example.com 
// !h-BG0Wc
// email sandbox business
// sb-9llxb51869205@business.example.com
// e@ExmG#8
// response success
// facilitatorAccessToken: "A21AAIYmwiPlaizN9OnYR4MhOU4TEiPGt6TePzX6MQQ7BMLuFPD7uBbTyQ2fyaEn6eXryhydvAHHE0TQNN5sP118l8Lcwm3Yw"
// ​
// orderID: "3SU421181B234273J"
// ​
// paymentSource: "paypal"
// ​
// subscriptionID: "I-W0CJELBLVXBB"