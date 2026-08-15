import { toCostApproval } from '@/api/services/serviService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Coins } from 'lucide-react';
import React, { useState } from 'react';

export function ToCostApprovalTransitionForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [processing, setProcessing] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) {
            return;
        }
        setProcessing(true);
        showLoading();
        try {
            const response = await toCostApproval(serviceId);
            success(response.message);
            closeModal();
            router.visit('/service');
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            error(err.response.data?.message ?? 'Ha ocurrido un error.');
        } finally {
            setProcessing(false);
            hideLoading();
        }
    };

    return (
        <form onSubmit={submit} className="flex w-full flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        Enviar a aprobación de costos
                    </CardTitle>
                    <CardDescription>
                        El servicio pasará a la sección de aprobación de costos. Ahí podrás solicitar la aprobación del cliente por correo, whatsapp o
                        verbalmente.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Enviar a aprobación</p>
                        <p className="text-muted-foreground text-sm">El servicio avanzará al siguiente paso del flujo.</p>
                    </div>
                    <Button type="submit" size="lg" disabled={processing}>
                        <Coins className="mr-2 h-4 w-4" />
                        Enviar a aprobación de costos
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
