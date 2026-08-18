import { NavDropDown } from '@/components/cards/service/NavDropDown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { appUrl } from '@/config/env';
import { mainNavItems } from '@/constants/items';
import { ServiceStatus } from '@/constants/service-status';
import { useInitials } from '@/hooks/use-initials';
import { ServiData } from '@/types';
import { Boxes, CalendarDays, ClipboardList, MoreVertical, Package, Stethoscope, Wrench } from 'lucide-react';

interface ServiceDataPropCard {
    service: ServiData;
    handleDelete: () => void;
}

const statusMap: Record<number, { label: string; className: string }> = {
    [ServiceStatus.Reception]: { label: 'Recepción', className: 'border-blue-200 bg-blue-100 text-blue-700' },
    [ServiceStatus.Diagnosis]: { label: 'Diagnóstico', className: 'border-violet-200 bg-violet-100 text-violet-700' },
    [ServiceStatus.SparePartApproval]: { label: 'Repuestos', className: 'border-orange-200 bg-orange-100 text-orange-700' },
    [ServiceStatus.CostApproval]: { label: 'Aprobación de costos', className: 'border-teal-200 bg-teal-100 text-teal-700' },
    [ServiceStatus.InRepair]: { label: 'Reparación', className: 'border-gray-200 bg-gray-100 text-gray-700' },
    [ServiceStatus.Repaired]: { label: 'Reparado', className: 'border-green-200 bg-green-100 text-green-700' },
    [ServiceStatus.Delivered]: { label: 'Entregado', className: 'border-green-200 bg-green-100 text-green-700' },
    [ServiceStatus.Incident]: { label: 'Incidencia', className: 'border-red-200 bg-red-100 text-red-700' },
};

const formatDate = (date: string) =>
    new Date(date).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const ServiceCard = ({ service, handleDelete }: ServiceDataPropCard) => {
    const getInitials = useInitials();
    const status = statusMap[service.status_id] ?? { label: 'Servicio', className: '' };
    const diagnosedIssues = service.service_issues.filter((issue) => issue.diagnosis);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                <div className="flex items-center gap-3">
                    <Wrench className="text-muted-foreground h-5 w-5" />
                    <div>
                        <CardTitle className="text-base">Servicio {service.uuid}</CardTitle>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={status.className}>
                        {status.label}
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Acciones del servicio">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <NavDropDown items={mainNavItems} service={service} handleDelete={handleDelete} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* FOTO */}
                    <img
                        src={service.file?.[0]?.path ? `${appUrl}/storage/${service.file?.[0]?.path}` : `${appUrl}/images/image.png`}
                        className="w-full shrink-0 rounded-xl border object-cover lg:w-[320px]"
                        alt="Servi File"
                    />

                    {/* DETALLES — 2 columnas en desktop, 1 en mobile */}
                    <div className="grid min-w-0 flex-1 gap-5 sm:grid-cols-2">
                        {/* COLUMNA 1 */}
                        <div className="space-y-5">
                            {/* CLIENTE */}
                            <div className="flex gap-3">
                                <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(service.client.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-sm">Cliente</p>
                                    <p className="font-semibold">{service.client.name}</p>
                                    <p className="text-muted-foreground text-sm">{service.client.phone}</p>
                                    <p className="text-muted-foreground text-sm [overflow-wrap:anywhere]">{service.client.email}</p>
                                </div>
                            </div>

                            {/* PRODUCTO */}
                            <div className="flex gap-3">
                                <Package className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />

                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-sm">Producto</p>
                                    <p className="font-semibold">{service.product.name}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {service.product.brand} {service.product.model}
                                    </p>
                                </div>
                            </div>

                            {/* DETALLES DE INGRESO */}
                            <div className="flex gap-3">
                                <ClipboardList className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />

                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-sm">Detalles de ingreso</p>
                                    <ul className="mt-1 space-y-1">
                                        {service.service_issues.map((issue) => (
                                            <li key={issue.id} className="text-sm">
                                                {issue.issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA 2 */}
                        <div className="space-y-5">
                            {/* DIAGNÓSTICO */}
                            {diagnosedIssues.length > 0 && (
                                <div className="flex gap-3">
                                    <Stethoscope className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />

                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-sm">Diagnóstico</p>
                                        <ul className="mt-1 space-y-1">
                                            {diagnosedIssues.map((issue) => (
                                                <li key={issue.id} className="text-sm">
                                                    {issue.diagnosis}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* REPUESTOS */}
                            {service.spareparts && service.spareparts.length > 0 && (
                                <div className="flex gap-3">
                                    <Boxes className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />

                                    <div className="min-w-0">
                                        <p className="text-muted-foreground text-sm">Repuestos</p>
                                        <ul className="mt-1 space-y-1">
                                            {service.spareparts.map((part) => (
                                                <li key={part.id} className="text-sm">
                                                    {part.brand} {part.model}
                                                    <span className="text-muted-foreground ml-1">— ${part.price.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* FECHA */}
                            <div className="flex gap-3">
                                <CalendarDays className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />

                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-sm">Fecha de ingreso</p>
                                    <p className="text-sm">{formatDate(service.date_entry)}</p>
                                </div>
                            </div>

                            {service.approve_spare_parts === 1 && (
                                <Badge variant="outline" className="border-green-200 text-green-700">
                                    Instalación de piezas aprobada por cliente
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export { ServiceCard };
