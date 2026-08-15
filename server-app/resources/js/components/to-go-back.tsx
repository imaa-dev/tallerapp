import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { ServiData } from '@/types';
import { useForm } from '@inertiajs/react';
import { Undo2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function ToGoBack({ service }: { service: ServiData }) {
    const { closeModal } = useModal();
    const { success, error } = useToast();
    const [serviceId] = useState(service.id);
    const [statusServiceId] = useState(service.status_id);

    const { post, processing } = useForm({
        service_id: serviceId,
        status_service_id: statusServiceId,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/to-go-back/service', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if (message) {
                    success(message);
                }
                closeModal();
            },
            onError: (e) => {
                error(e.message);
                console.log(e, 'ERROR_INERTIA_POST');
                closeModal();
            },
        });
    };

    return (
        <form className="flex w-full flex-col gap-4" onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Undo2 className="h-5 w-5" />
                        Regresar servicio a estado anterior
                    </CardTitle>
                    <CardDescription>El servicio volverá a la sección anterior del flujo de trabajo.</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Regresar servicio</p>
                        <p className="text-muted-foreground text-sm">Confirmá para continuar con el cambio de estado.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={1} disabled={processing}>
                        <Undo2 className="mr-2 h-4 w-4" />
                        Regresar
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
