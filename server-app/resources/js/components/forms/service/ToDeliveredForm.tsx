import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@inertiajs/react';
import { Handshake } from 'lucide-react';
import { FormEventHandler } from 'react';

export function ToDeliveredForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { post, processing } = useForm({
        service_id: serviceId,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/to-delivered/service', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                closeModal();
                if (message) {
                    success(message);
                }
            },
            onError: (e) => {
                error(e.message);
                console.log(e, 'Error');
            },
        });
    };

    return (
        <form className="flex w-full flex-col gap-4" onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Handshake className="h-5 w-5" />
                        Entregar servicio
                    </CardTitle>
                    <CardDescription>El servicio se marcará como entregado y finalizará su flujo de trabajo.</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Entregar servicio</p>
                        <p className="text-muted-foreground text-sm">Confirmá la entrega para continuar.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={1} disabled={processing}>
                        <Handshake className="mr-2 h-4 w-4" />
                        Entregar
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
