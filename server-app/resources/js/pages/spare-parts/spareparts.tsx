import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination, ListSparePartsData } from '@/types';
import { Head } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { deleteSparePart, getSpareParts } from '@/api/services/sparePartsListService';
import { useConfirmDialog } from '@/context/ModalContext';
import { useEffect, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { AskContent } from '@/components/ask-content';
import DataTableFilters from '@/components/data-table/DataTableFilters';
import DataFilterPagination from '@/components/data-table/DataFilterPagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Repuestos',
        href: '/spare-parts',
    }
];

interface SparePartsDataProp {
    notOrganization: boolean;
    spareParts: ListSparePartsData[];
    message: string | null;
    user_rol: string;
    pagination: Pagination
}

export default function SpareParts({ spareParts, notOrganization, message, user_rol, pagination: initialPagination }: SparePartsDataProp) {
    const [modalShow] = useState<boolean>(notOrganization)
    const [sparePartsShow, setSparePartsShow] = useState(spareParts)
    const [filters, setFilters] = useState({
        search: "",
        brand: "",
        model: "",
    });
    const [pagination, setPagination] = useState(initialPagination);
    const { showConfirm } = useConfirmDialog();
    const { success, error } = useToast();
    const { openModal } = useModal();

    const handleDelete = (sparePartId: number) => {
        showConfirm({
            title: "¿Deseas eliminar el repuesto?",
            onConfirm: () => handleRemoveSparePart(sparePartId)
        })
    }

    const handleFilterChange = (
        field: keyof typeof filters,
        value: string
    ) => {
        setFilters(prev => ({
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
            search: "",
            brand: "",
            model: "",
        };

        setFilters(reset);

        await searchSpareParts(1);

    };

    const handleRemoveSparePart = async (id: number) => {
        try {
            const response = await deleteSparePart(id);
            success(response.message);
            setSparePartsShow(prev => prev.filter(sp => sp.id !== id))
        } catch (err: any) {
            if (!err.response) {
                error("No fue posible conectar con el servidor.");
                return;
            }
            const status = err.response.status;
            switch (status) {
                case 409:
                    error(err.response.data.message ?? "No se pudo eliminar el registro.");
                    break;

                case 422:
                    error(err.response.data.message ?? "Los datos enviados son inválidos.");
                    break;

                case 401:
                    error("Tu sesión ha expirado.");
                    break;

                case 403:
                    error("No tienes permisos para realizar esta acción.");
                    break;

                case 404:
                    error("La organización no existe.");
                    break;

                case 500:
                    error("Ha ocurrido un error interno del servidor.");
                    break;

                default:
                    error(
                        err.response.data?.message ??
                        "Ha ocurrido un error inesperado."
                    );
            }
        }
    }

    useEffect(() => {
        if (modalShow) {
            openModal(() => (<AskContent message={message} userRol={user_rol} />));
        }
    }, [modalShow])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repuestos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col items-center gap-4 px-4 sm:px-5">
                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">

                            <DataTableFilters
                                fields={[
                                    {
                                        key: "search",
                                        label: "Buscar repuesto",
                                        placeholder: "Buscar modelo o marca"
                                    },
                                    {
                                        key: "brand",
                                        label: "Marca"
                                    },
                                    {
                                        key: "model",
                                        label: "Modelo"
                                    }
                                ]}
                                values={filters}
                                onChange={handleFilterChange}
                                onSearch={searchSpareParts}
                                onClear={clearFilters}
                                actions={null}
                            />

                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                {sparePart.brand}
                                            </td>
                                            <td className="px-6 py-4">
                                                {sparePart.model}
                                            </td>
                                            <td className="px-6 py-4">
                                                ${sparePart.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {sparePart.note}
                                            </td>
                                            <td className="px-6 py-4">
                                                {sparePart.service_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        handleDelete(sparePart.id)
                                                    }}
                                                >
                                                    <Trash2 color={'#b91c1c'} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <DataFilterPagination
                                pagination={pagination}
                                onPageChange={searchSpareParts}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}
