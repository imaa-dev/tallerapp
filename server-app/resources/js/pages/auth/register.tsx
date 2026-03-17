import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import handleImageUploadSingle from '@/lib/utils';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import React, { useState } from 'react';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';
const appUrl = import.meta.env.VITE_APP_URL;

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    file: File | null;
    nameOrganization: string;
    description: string;
    active: boolean;
};

export default function Register() {
    const [uploadImage, setUploadImage] = useState<string | null>(null);
    const { showLoading, hideLoading } = useLoading();
    const { error } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        file: null,
        nameOrganization: '',
        description: '',
        active: false
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };
    const handleImageChange = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setUploadImage(imageUrl)
    }

    return (
            <AuthLayout title="Crea una cuenta" description="Ingresa los siguientes detalles para crear tu cuenta">
                <Head title="Register" />
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre completo"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@ejemplo.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" >Celular</Label>
                            <Input
                                id="phone"
                                type="phone"
                                required
                                tabIndex={3}
                                autoComplete="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value) }
                        />
                        </div>
                    </div>    
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirmar Contraseña"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <div className='grid gap-6' >
                        <div className='grid gap-2'>
                            {uploadImage ? (
                                    <div className="group relative flex items-center justify-center">
                                        <img className="w-50" src={uploadImage} alt="Imagen Logo" />
                                    </div>
                                ) : (
                                    <div className="group relative flex items-center justify-center">
                                        <img className="w-50 p-5" src={`${appUrl}/images/organization.png `} alt="Imagen Logo" />
                                    </div>
                                )}
                        </div>
                        <div className='grid gap-2'>
                            <input
                                type="file"
                                name="file"
                                id="file"
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                tabIndex={5}
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
                        <div className='grid gap-2' >
                            <input
                                type="text"
                                name="organization_name"
                                id="organization_name"
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                placeholder="Nombre Organizacion"
                                required
                                autoComplete="name"
                                tabIndex={6}
                                value={data.nameOrganization}
                                onChange={(e) => setData('nameOrganization', e.target.value)}
                            />
                            
                            <InputError message={errors.nameOrganization} />
                        </div>
                        <div>
                            <input
                                type="description"
                                name="organizacion_description"
                                id="organizacion_description"
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                placeholder="Descripcion"
                                required
                                autoComplete="description"
                                tabIndex={7}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>
                    
                        <Button type="submit" className="mt-2 w-full" tabIndex={8} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear Cuenta
                        </Button>
                    </div>

                <div className="text-muted-foreground text-center text-sm">
                    ¿Tienes una cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={9}>
                        Iniciar sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
