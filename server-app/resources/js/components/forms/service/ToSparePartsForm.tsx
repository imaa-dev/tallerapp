import React, { FormEventHandler } from 'react';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useForm } from '@inertiajs/react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { useSpareParts } from '@/context/SparePartsContext';
import Select from 'react-select';
import { selectStyle } from '@/styles/reactSelect';
import { Button } from '@/components/ui/button';
import { CreateClientForm } from '@/components/forms/client/CreateClientForm';
import { Plus } from 'lucide-react';
import { CreateSparePartsForm } from '@/components/forms/service/CreateSparePartsForm';

interface ReceiptSpareParts {
    servi_id: number;
    notificate: boolean;
    notificate_client: boolean;
    spare_parts: number[];

}
export default function ToSparePartsForm ({ serviceId }: { serviceId: number }){

    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { spareParts } = useSpareParts();
    const { openModal } = useModal();
    const { post, setData, data, processing } = useForm<Required<ReceiptSpareParts>>({
        servi_id: serviceId,
        notificate: false,
        notificate_client: false,
        spare_parts: []
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/create-spare-parts-notificate', {
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
                <SidebarGroupLabel> Servicio seleccionar repuestos </SidebarGroupLabel>

                <div className="flex">
                    <Select
                        isMulti
                        options={spareParts.map((sp) => ({
                            value: sp.id,
                            label: `${sp.model} ${sp.brand} $${sp.price}`,
                            color: '#0052CC',
                        }))}
                        className="w-full"
                        tabIndex={1}
                        styles={selectStyle}
                        onChange={(selected) =>
                            setData(
                                'spare_parts',
                                selected.map((item) => item.value),
                            )
                        }
                    />
                    <Button type="button" className="ml-3" onClick={() => openModal(() =>  <CreateSparePartsForm serviceId={serviceId} /> )}>
                        <Plus />
                    </Button>
                </div>

                <div className="group relative z-0 mb-5 w-full">
                    <input
                        type="checkbox"
                        name="checkbox-notification-email"
                        checked={data.notificate}
                        id="check-notification-email"
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        tabIndex={2}
                        onChange={(e) => {
                            const checked = e.target.checked
                            setData('notificate', checked)
                            if(checked){
                                setData('notificate_client', false)
                            }
                        }}
                    />
                    <label htmlFor="isNotificable" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        ¿Aprobar instalacion con el cliente via email?
                    </label>
                </div>
                <div className="group relative z-0 mb-5 w-full" >
                    <input 
                        type="checkbox"
                        name="checkbox-notification-client"
                        id="checkbox-notification-client"
                        checked={data.notificate_client}
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        tabIndex={3}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setData('notificate_client', e.target.checked)
                            if (checked){
                                setData('notificate', false);    
                            } 
                            
                        }}
                    />
                    <label htmlFor="isNotificable" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        ¿Aprobar instalacion con el cliente en persona ?
                    </label>
                </div>
                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                    Agregar repuestos
                </Button>
            </form>
        </React.Fragment>
    );
}
