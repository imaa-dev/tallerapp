import { deleteSparePart, getSpareParts } from '@/api/services/sparePartsListService';
import DataFilterPagination from '@/components/data-table/DataFilterPagination';
import DataTableFilters from '@/components/data-table/DataTableFilters';
import { CreateSparePartsForm } from '@/components/forms/service/CreateSparePartsForm';
import { Button } from '@/components/ui/button';
import { useConfirmDialog } from '@/context/ModalContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ListSparePartsData, Pagination } from '@/types';
import { Head } from '@inertiajs/react';
import { Boxes, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Repuestos',
        href: '/spare-parts',
    },
];

interface SparePartsDataProp {
    spareParts: ListSparePartsData[];
    pagination: Pagination;
}

export default function SpareParts({ spareParts, pagination: initialPagination }: SparePartsDataProp) {
    const [sparePartsShow, setSparePartsShow] = useState(spareParts);
    const [filters, setFilters] = useState({
        search: '',
        brand: '',
        model: '',
    });
    const [pagination, setPagination] = useState(initialPagination);
    const { showConfirm } = useConfirmDialog();
    const { success, error } = useToast();
    const { openModal } = useModal();

    const handleDelete = (sparePartId: number) => {
        showConfirm({
            title: '¿Deseas eliminar el repuesto?',
            onConfirm: () => handleRemoveSparePart(sparePartId),
        });
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const searchSpareParts = async (page = 1) => {
        try {
            const response = await getSpareParts({
                ...filters,
                page,
            });

            if (response.success) {
                setSparePartsShow(response.spareParts);
                setPagination(response.pagination);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const clearFilters = async () => {
        const reset = {
            search: '',
            brand: '',
            model: '',
        };

        setFilters(reset);

        await searchSpareParts(1);
    };

    const handleRemoveSparePart = async (id: number) => {
        try {
            const response = await deleteSparePart(id);
            success(response.message);
            setSparePartsShow((prev) => prev.filter((sp) => sp.id !== id));
        } catch (err: any) {
            if (!err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const status = err.response.status;
            switch (status) {
                case 409:
                    error(err.response.data.message ?? 'No se pudo eliminar el registro.');
                    break;

                case 422:
                    error(err.response.data.message ?? 'Los datos enviados son inválidos.');
                    break;

                case 401:
                    error('Tu sesión ha expirado.');
                    break;

                case 403:
                    error('No tienes permisos para realizar esta acción.');
                    break;

                case 404:
                    error('La organización no existe.');
                    break;

                case 500:
                    error('Ha ocurrido un error interno del servidor.');
                    break;

                default:
                    error(err.response.data?.message ?? 'Ha ocurrido un error inesperado.');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repuestos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <Boxes className="text-muted-foreground h-6 w-6" />
                                <h1 className="text-2xl font-semibold">Repuestos</h1>
                            </div>

                            <Button type="button" onClick={() => openModal(() => <CreateSparePartsForm onCreated={() => searchSpareParts(1)} />)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Repuestos
                            </Button>
                        </div>

                        <DataTableFilters
                            fields={[
                                {
                                    key: 'search',
                                    label: 'Buscar repuesto',
                                    placeholder: 'Buscar modelo o marca',
                                },
                                {
                                    key: 'brand',
                                    label: 'Marca',
                                },
                                {
                                    key: 'model',
                                    label: 'Modelo',
                                },
                            ]}
                            values={filters}
                            onChange={handleFilterChange}
                            onSearch={searchSpareParts}
                            onClear={clearFilters}
                            actions={null}
                        />

                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Marca
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Modelo
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Precio
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nota
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Servicio ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sparePartsShow.map((sparePart: ListSparePartsData, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                        >
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{sparePart.brand}</td>
                                            <td className="px-6 py-4">{sparePart.model}</td>
                                            <td className="px-6 py-4">${sparePart.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm">{sparePart.note}</td>
                                            <td className="px-6 py-4">{sparePart.service_id}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        handleDelete(sparePart.id);
                                                    }}
                                                >
                                                    <Trash2 color={'#b91c1c'} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <DataFilterPagination pagination={pagination} onPageChange={searchSpareParts} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
