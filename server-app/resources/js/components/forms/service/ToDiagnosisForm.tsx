import { sendToDiagnosis } from '@/api/services/serviService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle2, Mail, MessageCircle, Stethoscope } from 'lucide-react';
import { useState } from 'react';

type ApprovalMethod = 'email' | 'whatsapp' | 'verbal';

export function ToDiagnosisForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [processing, setProcessing] = useState(false);

    const submit = async (method: ApprovalMethod) => {
        if (processing) {
            return;
        }
        setProcessing(true);
        showLoading();
        try {
            const response = await sendToDiagnosis(serviceId, method);
            success(response.message);
            closeModal();
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
                        <Stethoscope className="h-5 w-5" />
                        Servicio a sección de Diagnóstico
                    </CardTitle>
                    <CardDescription>
                        El producto entrará a taller, tu cliente debe aprobar el comienzo de la reparación. ¿Cómo deseas solicitar la aprobación?
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                    <Button type="button" tabIndex={1} disabled={processing} onClick={() => submit('email')}>
                        <Mail className="h-4 w-4" />
                        Via correo
                    </Button>
                    <Button type="button" tabIndex={2} disabled={processing} onClick={() => submit('whatsapp')}>
                        <MessageCircle className="h-4 w-4" />
                        Via whatsapp
                    </Button>
                    <Button type="button" tabIndex={3} disabled={processing} onClick={() => submit('verbal')}>
                        <CheckCircle2 className="h-4 w-4" />
                        Verbalmente aprobado
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
