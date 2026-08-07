import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    BreadcrumbItem,
    ClientDataProp,
    ProductDataProp,
    ServiceIssue,
    ServiData,
    ServiForm
} from '@/types';
import { FormEventHandler, useState } from 'react';
import { Card } from '@/components/ui/card';
import { uploadIssue, deleteIssue } from '@/api/services/issuesService';
import ServiceDetailsForm from '@/components/forms/service/ServiceDetailsForm';
import ServiceImages from '@/components/forms/service/ServiceImages';
import ServiceUpdateForm from '@/components/forms/service/ServiceUpdateForm';
import ServiceSparePartsSection from '@/components/forms/service/ServiceSparePartsSection';
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
    const [issue, setIssue] = useState<string>('');
    const [issues, setIssues] = useState<ServiceIssue[]>(servi.service_issues)
    const { success, error } = useToast()
    const { showLoading, hideLoading } = useLoading()
    const { data, setData, post, errors, processing } = useForm<Required<ServiForm>>({
        id: servi.id,
        organization_id: servi.organization_id,
        product_id: servi.product_id,
        user_id: servi.user_id,
        date_entry: servi.date_entry,
    });
    const uploadIssueFn = async (issue: string, id: number) => {
        const response = await uploadIssue(issue, id)

        if(response.code === 200){
            success(response.message)
            setIssues(prev => [...prev, response.data])
            setIssue('')
        } else {
            error(response.message)
        }
    }

    const removeIssue = async (id: number) => {
        showLoading();
        const response = await deleteIssue(id)
        if(response.code === 200){
            success(response.message);
            setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
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
                         issue={issue}
                         issues={issues}
                         onIssueChange={setIssue}
                         onAddIssue={() => {
                             if (issue.trim() === '') {
                                 error('El detalle de ingreso no puede ir vacío');
                                 return;
                             }
                             uploadIssueFn(issue, servi.id);
                         }}
                         onDeleteIssue={removeIssue}
                     />
                  </Card>
                 <ServiceSparePartsSection spareparts={servi.spareparts} serviceId={servi.id} />
                 <ServiceImages initialFiles={servi.file} serviceId={servi.id} />
                </div>
            </div>
        </AppLayout>
    );
}
