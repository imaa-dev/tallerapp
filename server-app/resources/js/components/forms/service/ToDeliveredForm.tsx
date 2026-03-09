import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function ToDeliveredForm ({ serviceId } : { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { post, processing } = useForm({
        service_id: serviceId
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/to-delivered/service', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } } ).flash?.message;
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

    return(
        <React.Fragment>
            <form
                className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
                onSubmit={submit}
            >
                <SidebarGroupLabel> Entregar servicio </SidebarGroupLabel>
                <Button type="submit" className="mt-4 w-full" tabIndex={1} disabled={processing} >
                    Entregar
                </Button>
            </form>
        </React.Fragment>
    )
}
