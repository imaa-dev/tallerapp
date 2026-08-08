import React, { FormEventHandler } from 'react';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useForm } from '@inertiajs/react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import Select from 'react-select';
import { selectStyle } from '@/styles/reactSelect';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateSparePartsForm } from '@/components/forms/service/CreateSparePartsForm';
import { getSpareParts } from '@/api/services/sparepartsService';
import { useSpareParts } from '@/context/SparePartsContext';

interface ReceiptSpareParts {
    servi_id: number;
    spare_parts: number[];
}
export default function ToSparePartsForm ({ serviceId }: { serviceId: number }){

    const { success, error } = useToast();
    const { closeModal, openModal } = useModal();
    const { spareParts } = useSpareParts()
    const { post, setData, data, processing } = useForm<Required<ReceiptSpareParts>>({
        servi_id: serviceId,
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
                <SidebarGroupLabel> Repuestos </SidebarGroupLabel>

                <div className="flex">
                    <Select
                        isMulti
                        options={spareParts.map((sp) => ({
                            value: String(sp.id),
                            label: `${sp.model} ${sp.brand} $${sp.price}`,
                            color: '#0052CC',
                        }))}
                        className="w-full"
                        tabIndex={1}
                        styles={selectStyle}
                        onChange={(selected) =>
                            setData(
                                'spare_parts',
                                selected.map((item) => Number(item.value)),
                            )
                        }
                    />
                    <Button type="button" className="ml-3" onClick={() => openModal(() =>  <CreateSparePartsForm serviceId={serviceId} /> )}>
                        <Plus />
                    </Button>
                </div>

                <Button type="submit" className="mt-4 w-full" tabIndex={2} disabled={processing}>
                    Agregar repuestos
                </Button>
            </form>
        </React.Fragment>
    );
}
