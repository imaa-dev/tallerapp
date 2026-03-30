import React, { FormEventHandler } from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useForm } from '@inertiajs/react';

interface ServiceDiagnosis {
    service_id: number;
    notification_client: boolean;
}
export function ToDiagnosisForm ({ serviceId }: { serviceId: number }) {

    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { post, setData, processing } = useForm<Required<ServiceDiagnosis>>({
        service_id: serviceId,
        notification_client: false
    })
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/to-diagnosis/service', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                closeModal();
                if(message){
                    success(message)
                }
            },
            onError: (e) => {
                error(e.message);
                console.log(e, 'Error')
            }
        })
    }
    return (
        <React.Fragment>
            <form className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800" onSubmit={submit}>
                <SidebarGroupLabel> Servicio a sección de Diagnostico </SidebarGroupLabel>
                <div className="group relative z-0 mb-5 w-full">
                    <input
                        type="checkbox"
                        name="check-notification"
                        id="check-notifification"
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        tabIndex={1}
                        onChange={(e) => setData('notification_client', e.target.checked)}
                    />
                    <label htmlFor="check-notifification" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        Notificar al cliente que el producto entra a inspección
                    </label>
                    <Button type="submit" className="mt-4 w-full" tabIndex={2} disabled={processing}>
                        Servicio a Diagnosticar
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
}
