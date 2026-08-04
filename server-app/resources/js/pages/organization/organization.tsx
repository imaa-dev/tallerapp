import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem, OrganizationData } from '@/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Users,
    Wrench,
    Package,
    UserRound,
    Pencil,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organización',
        href: '/organization/show',
    },
];

interface OrganizationDataProp {
    organization: OrganizationData;
}

const appUrl = import.meta.env.VITE_APP_URL;

export default function Organization({ organization }: OrganizationDataProp) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organización" />

            <div className="flex flex-col gap-6 p-6">

                {/* HEADER */}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                        <h1 className="text-2xl font-semibold">
                            Organización
                        </h1>
                    </div>

                    {organization && (
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.visit(`/organization/${organization.id}/edit`)
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    )}
                </div>

                {!organization ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-6 py-20">

                            <img
                                src={`${appUrl}/images/organization.png`}
                                className="h-40 opacity-60"
                            />

                            <div className="text-center">
                                <h2 className="text-2xl font-semibold">
                                    Aún no tienes una organización
                                </h2>

                                <p className="mt-2 text-muted-foreground">
                                    Crea una organización para comenzar a utilizar
                                    TallerApp.
                                </p>
                            </div>

                            <Button
                                onClick={() =>
                                    router.visit('/create/organization')
                                }
                            >
                                Crear organización
                            </Button>

                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* INFORMACIÓN */}

                        <Card>

                            <CardContent className="p-8">

                                <div className="grid gap-8 lg:grid-cols-[300px_1fr]">

                                    {/* Logo */}

                                    <div>

                                        <img
                                            src={
                                                organization.file?.path
                                                    ? `${appUrl}/storage/${organization.file.path}`
                                                    : `${appUrl}/images/image.png`
                                            }
                                            className="aspect-square w-full rounded-xl border object-cover"
                                        />

                                    </div>

                                    {/* Datos */}

                                    <div className="space-y-6">

                                        <div>
                                            <h2 className="text-3xl font-bold">
                                                {organization.name}
                                            </h2>

                                            <p className="mt-2 text-muted-foreground">
                                                {organization.description ||
                                                    'Sin descripción'}
                                            </p>
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">

                                            <div className="flex gap-3">
                                                <Mail className="mt-1 h-5 w-5 text-muted-foreground" />

                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Email
                                                    </p>

                                                    <p>
                                                        {organization.email ??
                                                            '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Phone className="mt-1 h-5 w-5 text-muted-foreground" />

                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Teléfono
                                                    </p>

                                                    <p>
                                                        {organization.phone ??
                                                            '-'}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>

                        {/* MÉTRICAS */}

                        <div className="grid gap-4 md:grid-cols-4">

                            <Card>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Usuarios
                                        </p>

                                        <p className="text-3xl font-bold">
                                            2
                                        </p>
                                    </div>

                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Servicios
                                        </p>

                                        <p className="text-3xl font-bold">
                                            14
                                        </p>
                                    </div>

                                    <Wrench className="h-8 w-8 text-muted-foreground" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Productos
                                        </p>

                                        <p className="text-3xl font-bold">
                                            35
                                        </p>
                                    </div>

                                    <Package className="h-8 w-8 text-muted-foreground" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Clientes
                                        </p>

                                        <p className="text-3xl font-bold">
                                            20
                                        </p>
                                    </div>

                                    <UserRound className="h-8 w-8 text-muted-foreground" />
                                </CardContent>
                            </Card>

                        </div>

                        {/* DIRECCIÓN */}

                        <Card>

                            <CardHeader>

                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Dirección
                                </CardTitle>

                            </CardHeader>

                            <CardContent>

                                <div className="space-y-2">

                                    <p>
                                        {organization.address ??
                                            'Sin dirección registrada'}
                                    </p>

                                    <p className="text-muted-foreground">

                                        {[
                                            organization.city,
                                            organization.state,
                                            organization.country,
                                        ]
                                            .filter(Boolean)
                                            .join(', ')}

                                    </p>

                                </div>

                            </CardContent>

                        </Card>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
