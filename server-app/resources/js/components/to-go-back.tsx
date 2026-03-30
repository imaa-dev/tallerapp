import React, { FormEventHandler, useState } from 'react';
import { ServiData } from '@/types';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@inertiajs/react';

export default function ToGoBack ({ service } : { service: ServiData }) {
    const { closeModal } = useModal()
    const { success, error } = useToast()
    const [ serviceId ] = useState(service.id);
    const [ statusServiceId ] = useState(service.status_id);

    const { post, processing } = useForm({
        service_id: serviceId,
        status_service_id:  statusServiceId
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/to-go-back/service', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if(message){
                    success(message);
                }
                closeModal()
            },
            onError: (e) => {
                error(e.message)
                console.log(e, 'ERROR_INERTIA_POST')
                closeModal()
            }

        })
    }

    return(
        <React.Fragment>
            <form
                onSubmit={submit}
                className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
            >
                <SidebarGroupLabel> Regresar servicio a estado anterior </SidebarGroupLabel>
                <div className="group relative z-0 mb-5 w-full">
                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={1}
                        disabled={processing}
                    >
                        Regresar
                    </Button>
                </div>
            </form>
        </React.Fragment>
    )
}
