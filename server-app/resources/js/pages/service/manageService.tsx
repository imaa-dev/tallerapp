import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    BreadcrumbItem,
    ClientDataProp,
    ProductDataProp, Reasons,
    ServiData,
    ServiForm
} from '@/types';
import { FormEventHandler, useState } from 'react';
import { Card } from '@/components/ui/card';
import { deleteReason, uploadReasons } from '@/api/services/reasonsService';
import ServiceDetailsForm from '@/components/forms/service/ServiceDetailsForm';
import ServiceImages from '@/components/forms/service/ServiceImages';
import ServiceUpdateForm from '@/components/forms/service/ServiceUpdateForm';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: '/service'
    },
    {
        title: 'Actualizar',
        href: '/service'
    },
]

interface ServiProp {
    servi: ServiData
}

export default function ManageService({ servi, clients, products }: ServiProp & ProductDataProp & ClientDataProp) {
    const [reason, setReason] = useState<string>('');
    const [reasons, setReasons] = useState<Reasons[]>(servi.reasons)
    const { success, error } = useToast()
    const { showLoading, hideLoading } = useLoading()
    const { data, setData, post, errors, processing } = useForm<Required<ServiForm>>({
        id: servi.id,
        organization_id: servi.organization_id,
        product_id: servi.product_id,
        user_id: servi.user_id,
        date_entry: servi.date_entry,
    });
    const uploadReason = async (reason: string, id: number) => {
        const response = await uploadReasons(reason, id)

        if(response.code === 200){
            success(response.message)
            setReasons(response.data)
            setReason('')
        } else {
            error(response.message)
        }
    }

    const removeReason = async (id: number) => {
        showLoading();
        const response = await deleteReason(id)
        if(response.code === 200){
            success(response.message);
            setReasons((prevReason) => prevReason.filter((reason) => reason.id !== id));
        } else {
            error(response.message)
        }
        hideLoading()
    }
    const submit: FormEventHandler = (e) => {
        showLoading()
        e.preventDefault();
        post('/manage/service', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if (message) {
                    success(message);
                }
            },
            onError: ((e) => {
                console.log(e)
                error(e.message)
            })
        });
        hideLoading()
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestionar" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl">
                <div className="relative m-5 overflow-x-auto shadow-md sm:rounded-lg">
                <ServiceUpdateForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    onChange={setData}
                    onSubmit={submit}
                    products={products}
                    clients={clients}
                />
                  <Card className="m-5 mt-10 max-w-xl p-6">
                     <ServiceDetailsForm
                         reason={reason}
                         reasons={reasons}
                         onReasonChange={setReason}
                         onAddReason={() => {
                             if (reason.trim() === '') {
                                 error('El detalle de ingreso no puede ir vacío');
                                 return;
                             }
                             uploadReason(reason, servi.id);
                         }}
                         onDeleteReason={removeReason}
                     />
                  </Card>
                 <ServiceImages initialFiles={servi.file} serviceId={servi.id} />
                </div>
            </div>
        </AppLayout>
    );
}
