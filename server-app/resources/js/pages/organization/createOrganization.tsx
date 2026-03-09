import { Button } from '@/components/ui/button';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {useState} from "react";
import handleImageUploadSingle from '@/lib/utils';
import InputError from '@/components/input-error';
import { useLoading } from '@/context/LoadingContext';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import ButtonBack from '@/components/button-back';
import { useToast } from '@/context/ToastContext';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organización',
        href: '/organization/show',
    },
    {
        title: 'Crear',
        href: '/organization/show',
    }
];

type CreateOrganizationForm = {
    file: File | null,
    name: string,
    description: string,
    active: boolean,
}
const appUrl = import.meta.env.VITE_APP_URL;

const CreateOrganization = () => {
    const { success, error } = useToast()
    const { showLoading, hideLoading } = useLoading();
    const { data, setData, post, reset, errors, processing } = useForm<Required<CreateOrganizationForm>>({
        file: null,
        name: '',
        description: '',
        active: false,
    })

    const [uploadImage, setUploadImage] = useState<string | null>(null);

    const handleImageChange = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setUploadImage(imageUrl)
    }
    const submit: FormEventHandler = (e) => {
        showLoading();
        e.preventDefault();
        post('/create/organization',{
            preserveScroll: true,
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if(message) {
                    success(message);
                }
                reset()
            },
            onError: (res) => {
                if(res.file){
                    error(res.file);
                }
                if(res.description){
                    error(res.description);
                }
                if(res.active){
                    error(res.active);
                }
                if(res.name){
                    error(res.name);
                }
            }
        })
        hideLoading();
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organization" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <ButtonBack />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl">
                <div className="relative m-5 overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="inline-flex rounded-md shadow-xs">
                        <form
                            className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
                            onSubmit={submit}
                        >
                            <SidebarGroupLabel> Crear Organización </SidebarGroupLabel>
                            {uploadImage ? (
                                <div className="group relative flex items-center justify-center">
                                    <img className="w-50" src={uploadImage} alt="Imagen Logo" />
                                </div>
                            ) : (
                                <div className="group relative flex items-center justify-center">
                                    <img className="w-50 p-5" src={`${appUrl}/images/organization.png `} alt="Imagen Logo" />
                                </div>
                            )}
                            <div className="group relative z-0 mb-12 w-full">
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                    tabIndex={1}
                                    autoComplete="file"
                                    onChange={(e) => {
                                        showLoading();
                                        const fileRes = e.target.files?.[0];
                                        if (fileRes) {
                                            handleImageUploadSingle(fileRes).then((res) => {
                                                setData('file', res);
                                                handleImageChange(res);
                                                hideLoading()
                                            }).catch((err) => {
                                                error('Error al comprimir la imagen')
                                                console.log('ONCHANGE_INPUT_FILE_ERROR', err)
                                                hideLoading()
                                            });
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="floating_email"
                                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                                >
                                    Icono Marca Organizacion
                                </label>
                                <InputError message={errors.file} />
                            </div>
                            <div className="group relative z-0 mb-5 w-full">
                                <input
                                    type="text"
                                    name="organization_name"
                                    id="organization_name"
                                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                    placeholder=" "
                                    required
                                    autoComplete="name"
                                    tabIndex={2}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <label
                                    htmlFor="floating_name"
                                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                                >
                                    Nombre Organización <span className="text-red-500">*</span>
                                </label>
                                <InputError message={errors.name} />
                            </div>
                            <div className="group relative z-0 mb-5 w-full">
                                <input
                                    type="description"
                                    name="organizacion_description"
                                    id="organizacion_description"
                                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                    placeholder=" "
                                    required
                                    autoComplete="description"
                                    tabIndex={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <label
                                    htmlFor="floating_description"
                                    className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                                >
                                    Descripción <span className="text-red-500">*</span>
                                </label>
                                <InputError message={errors.description} />
                            </div>
                            <div className="group relative z-0 mb-5 w-full">

                                <label className="inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        tabIndex={4}
                                        autoComplete="active"
                                        className="peer sr-only"
                                        onChange={(e) => setData('active', e.target.checked)}
                                    />
                                    <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activar organización  <span className="text-red-500">*</span></span>
                                </label>
                                <InputError message={errors.active} />
                            </div>
                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                disabled={processing}
                            >
                                Crear Organización
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}
export default CreateOrganization;
