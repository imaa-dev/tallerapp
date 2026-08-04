import { Button } from '@/components/ui/button';
import React, { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OrganizationData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Upload, Save, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';
import handleImageUploadSingle from '@/lib/utils';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organización',
        href: '/organization/show'
    },
    {
        title: 'Actualizar',
        href: '/organization/show',
    }

];
type EditOrganizationForm = {
    id: number;
    user_id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    state:string;
    country: string;
    postal_code: string;
    phone: string;
    email: string;
    website: string;
    file: File | null;
};
const appUrl = import.meta.env.VITE_APP_URL;
interface OrganizationEditFormProps {
    organizationUpdate: OrganizationData;
}
export default function EditOrganization({organizationUpdate}: OrganizationEditFormProps) {

    const { success, error } = useToast()
    const { showLoading, hideLoading } = useLoading();
    const { data, setData, post, reset, errors, processing } = useForm<Required<EditOrganizationForm>>({
        id: organizationUpdate.id,
        user_id: organizationUpdate.user_id,
        file: null,
        name: organizationUpdate.name,
        description: organizationUpdate.description,
        address: organizationUpdate.address,
        city: organizationUpdate.city,
        state: organizationUpdate.state,
        country: organizationUpdate.country,
        postal_code: organizationUpdate.postal_code,
        phone: organizationUpdate.phone,
        email: organizationUpdate.email,
        website: organizationUpdate.website
    })
    const [uploadImage, setUploadImage] = useState<string | null>(null)
    const handleUploadImage = (file: File) => {
        const temporalURL = URL.createObjectURL(file)
        setUploadImage(temporalURL)
    }
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        showLoading();
        post('/organization/edit', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                const flash = (
                    page.props as {
                        flash?: {
                            error?: string;
                            error_code?: string;
                        };
                    }
                ).flash;

                if(message) {
                    success(message);
                }
                if (flash?.error_code === 'ORGANIZATION_INACTIVE') {
                    error(flash.error ?? "Ha ocurrido un error");
                }
                reset()
            },
            onError: ((res) => {

            })
        })
        hideLoading();
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actualizar Organización" />
            <form onSubmit={submit}>
                <div className="flex flex-col gap-6 p-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Building2 className="text-muted-foreground h-6 w-6" />
                            <div>
                                <h1 className="text-2xl font-semibold">Actualizar organización</h1>
                                <p className="text-muted-foreground text-sm">Modifica la información principal de tu empresa.</p>
                            </div>
                        </div>
                    </div>

                    {/* INFORMACIÓN PRINCIPAL */}
                    <Card>
                        <CardContent className="p-8">
                            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
                                {/* LOGO */}
                                <div className="space-y-4">
                                    <img
                                        src={
                                            uploadImage
                                                ? uploadImage
                                                : organizationUpdate.file
                                                  ? `${appUrl}/storage/${organizationUpdate.file.path}`
                                                  : 'https://placehold.co/600x600/111827/F9FAFB?text=LOGO'
                                        }
                                        className="aspect-square w-full rounded-xl border object-cover"
                                        alt="Logo organización"
                                    />

                                    {/* Input oculto */}

                                    <input
                                        type="file"
                                        id="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            showLoading();

                                            const fileRes = e.target.files?.[0];

                                            if (!fileRes) {
                                                hideLoading();
                                                return;
                                            }

                                            handleImageUploadSingle(fileRes)
                                                .then((res) => {
                                                    setData('file', res);
                                                    handleUploadImage(res);
                                                    hideLoading();
                                                })
                                                .catch((err) => {
                                                    console.error(err);
                                                    error('Error al comprimir la imagen');
                                                    hideLoading();
                                                });
                                        }}
                                    />

                                    {/* Botón */}

                                    <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('file')?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Cambiar imagen
                                    </Button>

                                    <p className="text-muted-foreground text-center text-xs">PNG, JPG o WEBP. Máximo 5 MB.</p>

                                    <InputError message={errors.file} />
                                </div>

                                {/* FORMULARIO */}
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="name">
                                            Nombre de la organización <span className="text-red-500">*</span>
                                        </Label>
                                        <Input id="name" value={data.name} className="mt-2" required onChange={(e) => setData('name', e.target.value)} />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">
                                            Descripción <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-2"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="email">Email de contacto</Label>
                                            <div className="relative mt-2">
                                                <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                                <Input
                                                    id="email"
                                                    className="pl-9"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                />
                                                <InputError message={errors.email} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Teléfono</Label>
                                            <div className="relative mt-2">
                                                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                                <Input
                                                    id="phone"
                                                    className="pl-9"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                />
                                                <InputError message={errors.phone} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="website">Sitio web</Label>
                                        <div className="relative mt-2">
                                            <Globe className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                                            <Input
                                                id="website"
                                                className="pl-9"
                                                value={data.website}
                                                onChange={(e) => setData('website', e.target.value)}
                                            />
                                            <InputError message={errors.website} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* DIRECCIÓN */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Dirección
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input id="address" className="mt-2" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                    <InputError message={errors.address} />
                                </div>

                                <div>
                                    <Label htmlFor="city">Ciudad</Label>
                                    <Input id="city" className="mt-2" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                    <InputError message={errors.city} />
                                </div>

                                <div>
                                    <Label htmlFor="state">Región</Label>
                                    <Input id="state" className="mt-2" value={data.state} onChange={(e) => setData('state', e.target.value)} />
                                    <InputError message={errors.state} />
                                </div>

                                <div>
                                    <Label htmlFor="country">País</Label>
                                    <Input id="country" className="mt-2" value={data.country} onChange={(e) => setData('country', e.target.value)} />
                                    <InputError message={errors.country} />
                                </div>

                                <div>
                                    <Label htmlFor="postal">Código postal</Label>
                                    <Input
                                        id="postal"
                                        className="mt-2"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                    />
                                    <InputError message={errors.postal_code} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FOOTER */}
                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="font-medium">Guardar cambios</p>
                                <p className="text-muted-foreground text-sm">Los cambios se aplicarán inmediatamente.</p>
                            </div>

                            <Button size="lg" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Actualizar organización
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </AppLayout>
    );
}


