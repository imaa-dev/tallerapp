import { sendFinalRepair } from '@/api/services/serviService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle2, Mail, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

type ApprovalMethod = 'email' | 'whatsapp' | 'verbal';

export function SendFinalRepairForm({ serviceId, repairPrice, finalNote }: { serviceId: number; repairPrice: number; finalNote: string }) {
    const { success, error } = useToast();
    const { closeAllModals } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [processing, setProcessing] = useState(false);

    const submit = async (method: ApprovalMethod) => {
        if (processing) {
            return;
        }
        setProcessing(true);
        showLoading();
        try {
            const response = await sendFinalRepair(serviceId, method, repairPrice, finalNote);
            success(response.message);
            closeAllModals();
            if (response.whatsapp_url) {
                window.location.href = response.whatsapp_url;
                return;
            }
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
        <form className="flex w-full flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Informar reparación finalizada
                    </CardTitle>
                    <CardDescription>Comunicale al cliente que su servicio ya fue reparado. ¿Cómo deseas informarle?</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                    <Button type="button" tabIndex={1} disabled={processing} onClick={() => submit('email')}>
                        <Mail className="h-4 w-4" />
                        Via correo
                    </Button>
                    <Button type="button" tabIndex={2} disabled={processing} onClick={() => submit('whatsapp')}>
                        <MessageCircle className="h-4 w-4" />
                        Via WhatsApp
                    </Button>
                    <Button type="button" tabIndex={3} disabled={processing} onClick={() => submit('verbal')}>
                        <CheckCircle2 className="h-4 w-4" />
                        Gestionado verbalmente
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
