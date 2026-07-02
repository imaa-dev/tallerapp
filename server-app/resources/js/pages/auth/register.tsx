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
import { SidebarGroupLabel } from '@/components/ui/sidebar';
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
                <form className="flex flex-col gap-6" onSubmit={submit} autoComplete="off">
                    <SidebarGroupLabel>
                        DATOS ORGANIZACION
                    </SidebarGroupLabel>
                    <div className='grid gap-6' >
                        <Label id='icon-organization' > Icono organizacion </Label>
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
                                tabIndex={0}
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
                            
                            <InputError message={errors.file} />
                        </div>
                        <div className='grid gap-2' >
                            
                            <Input
                                type="text"
                                name="organization_name"
                                id="organization_name"
                                placeholder="Nombre Organizacion"
                                required
                                autoComplete="name"
                                tabIndex={1}
                                value={data.nameOrganization}
                                onChange={(e) => setData('nameOrganization', e.target.value)}
                            />

                            <InputError message={errors.nameOrganization} />
                        </div>
                        <div>
                           
                            <Input
                                type="description"
                                name="organizacion_description"
                                id="organizacion_description"
                                placeholder="Descripcion"
                                required
                                autoComplete="description"
                                tabIndex={2}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>
                    </div>
                    <SidebarGroupLabel>
                        DATOS USUARIO
                    </SidebarGroupLabel>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={3}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Nombre completo"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                           
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={4}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@ejemplo.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            
                            <Input
                                id="phone"
                                type="phone"
                                required
                                tabIndex={5}
                                autoComplete="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value) }
                                placeholder="Celular ejemplo: 56999222211"
                        />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                       
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={7}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirmar Contraseña"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={8} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Crear Cuenta
                    </Button>
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
