import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useModal } from '@/context/ModalContextForm';
import VerificateEmailCode from '@/components/verificate-email-code';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de perfil',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
}

export default function Profile({ status }: { status?: string }) { 
    const { auth } = usePage<SharedData>().props;
    const { openModal } = useModal();
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Información del perfil" description="Actualiza información" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Nombre completo"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>
                {auth.user.email_verified_at === null && (
                <div>
                      <div className="mt-2 text-sm font-medium">
                          <p className="text-muted-foreground -mt-4 text-sm text-red-600">
                            Tu dirección de email no está verificada.{' '}
                          </p>
                        </div>
                        <Button
                            variant="destructive"
                            className="mt-5"
                            onClick={() => openModal( () => ( <VerificateEmailCode /> ) ) }
                        >
                            Verificar email
                        </Button>

                </div>
                )}

                { auth.user.email_verified_at !== null && (
                    <div className="mt-2 text-sm font-medium text-green-600">
                        Email verificado
                    </div>
                ) }
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
