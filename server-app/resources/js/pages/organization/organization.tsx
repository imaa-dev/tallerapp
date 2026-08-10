import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OrganizationData } from '@/types';
import { Head, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe, Mail, MapPin, Package, Pencil, Phone, UserRound, Users, Wrench } from 'lucide-react';

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
                        <Building2 className="text-muted-foreground h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Organización</h1>
                    </div>

                    <Button variant="outline" onClick={() => router.visit(`/organization/${organization.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </div>

                {/* INFORMACIÓN */}

                <Card>
                    <CardContent className="p-8">
                        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                            {/* Logo */}

                            <div>
                                <img
                                    src={organization.file?.path ? `${appUrl}/storage/${organization.file.path}` : `${appUrl}/images/image.png`}
                                    className="aspect-square w-full rounded-xl border object-cover"
                                />
                            </div>

                            {/* Datos */}

                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold">{organization.name}</h2>

                                    <p className="text-muted-foreground mt-2">{organization.description || 'Sin descripción'}</p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="flex gap-3">
                                        <Mail className="text-muted-foreground mt-1 h-5 w-5" />

                                        <div>
                                            <p className="text-muted-foreground text-sm">Email</p>

                                            <p>{organization.email ?? '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Phone className="text-muted-foreground mt-1 h-5 w-5" />

                                        <div>
                                            <p className="text-muted-foreground text-sm">Teléfono</p>

                                            <p>{organization.phone ?? '-'}</p>
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
                                <p className="text-muted-foreground text-sm">Usuarios</p>

                                <p className="text-3xl font-bold">{organization.users_count}</p>
                            </div>

                            <Users className="text-muted-foreground h-8 w-8" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-muted-foreground text-sm">Servicios</p>

                                <p className="text-3xl font-bold">{organization.services_count}</p>
                            </div>

                            <Wrench className="text-muted-foreground h-8 w-8" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-muted-foreground text-sm">Productos</p>

                                <p className="text-3xl font-bold">{organization.products_count}</p>
                            </div>

                            <Package className="text-muted-foreground h-8 w-8" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-muted-foreground text-sm">Clientes</p>

                                <p className="text-3xl font-bold">{organization.clients_count}</p>
                            </div>

                            <UserRound className="text-muted-foreground h-8 w-8" />
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
                            <p>{organization.address ?? 'Sin dirección registrada'}</p>

                            <p className="text-muted-foreground">
                                {[organization.city, organization.state, organization.country].filter(Boolean).join(', ')}
                            </p>
                        </div>
                        {organization.postal_code && (
                            <div className="text-sm">
                                <span className="font-medium">Código postal:</span> {organization.postal_code}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* WEBSITE */}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Website
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-2">
                            <p>{organization.website ?? 'Sin website registrado'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
