import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem, User } from '@/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import 'react-phone-input-2/lib/style.css'
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import ButtonBack from '@/components/button-back';
import InputPhone from '@/components/input-phone';
import { useToast } from '@/context/ToastContext';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cliente',
        href: '/user-client'
    },
    {
        title: 'Actualizar',
        href: '/user-client'
    },
];

interface ClientProp {
    client: User
}

type ClientData = {
    id: number,
    name: string,
    email: string,
    phone: string,
    file: File | null
}
export default function EditClient({client}: ClientProp) {
    const { success, error } = useToast()
    const { post, setData, data, reset, errors, processing } = useForm<Required<ClientData>>({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        file: null
    })
    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(`/update-client`, {
            forceFormData: true,
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if(message) {
                    success(message);
                }
                reset()
            },
            onError: ((e) => {
                error(e.message)
            })
        })
    }
    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar cliente" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <ButtonBack />
            <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <form
                        className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
                        onSubmit={submit}
                    >
                    <SidebarGroupLabel> Actualizar Cliente </SidebarGroupLabel>

                    <div className="w-11111full group relative z-0 mb-5">
                            <input
                                type="text"
                                name="name_client"
                                id="name_client"
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <label
                                htmlFor="floating_name"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Nombre
                            </label>
                            <InputError message={errors.name} />
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                type="text"
                                name="email_client"
                                id="email_client"
                                required
                                tabIndex={3}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <label
                                htmlFor="floating_email"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Email
                            </label>
                            <InputError message={errors.email} />
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                            <label
                                htmlFor="floating_client"
                                className="absolute -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Celular
                            </label>
                            <InputPhone data={data} setData={setData} />
                            <InputError message={errors.phone} />
                        </div>
                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            tabIndex={4}
                            disabled={processing}
                        >
                            Actualizar Cliente
                        </Button>
                    </form>
                </div>
            </div>
            </div>
        </AppLayout>
    )
}
