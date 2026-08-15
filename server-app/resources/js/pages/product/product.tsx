import { deleteProduct, getProducts } from '@/api/product/productsService';
import DataFilterPagination from '@/components/data-table/DataFilterPagination';
import DataTableFilters from '@/components/data-table/DataTableFilters';
import CreateProductForm from '@/components/forms/product/CreateProductForm';
import { Button } from '@/components/ui/button';
import { useConfirmDialog } from '@/context/ModalContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Pagination, ProductData } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Productos',
        href: '/product',
    },
];
interface ProductDataProp {
    products: ProductData[];
    pagination: Pagination;
}
export default function Product({ products, pagination: initialPagination }: ProductDataProp) {
    const [productsShow, setProductsShow] = useState(products);
    const [filters, setFilters] = useState({
        search: '',
        brand: '',
        model: '',
    });
    const [pagination, setPagination] = useState(initialPagination);
    const { showConfirm } = useConfirmDialog();
    const { success, error } = useToast();
    const { openModal } = useModal();
    const handleDelete = (productId: number) => {
        showConfirm({
            title: 'Deseas eliminar el producto',
            onConfirm: () => handleRemoveProduct(productId),
        });
    };
    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const searchProducts = async (page = 1) => {
        try {
            const response = await getProducts({
                ...filters,
                page,
            });

            if (response.success) {
                setProductsShow(response.products);
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

        await searchProducts(1);
    };
    const handleRemoveProduct = async (id: number) => {
        try {
            const response = await deleteProduct(id);
            success(response.message);
            setProductsShow((prev) => prev.filter((pro) => pro.id !== id));
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const { status, data } = err.response;
            switch (status) {
                case 409:
                    error(data?.message ?? 'No se pudo eliminar el registro.');
                    break;

                case 422:
                    error(data?.message ?? 'Los datos enviados son inválidos.');
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
                    error(data?.message ?? 'Ha ocurrido un error inesperado.');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <div className="mb-6 flex items-center gap-3">
                            <Package className="text-muted-foreground h-6 w-6" />
                            <h1 className="text-2xl font-semibold">Productos</h1>
                        </div>

                        <DataTableFilters
                            fields={[
                                {
                                    key: 'search',
                                    label: 'Buscar producto',
                                    placeholder: 'Buscar tipo producto',
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
                            onSearch={searchProducts}
                            onClear={clearFilters}
                            actions={
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => openModal(() => <CreateProductForm onCreated={() => searchProducts(1)} />)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Producto
                                </Button>
                            }
                        />

                        <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tipo
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Modelo
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Marca
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsShow.map((product: ProductData, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                        >
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{product.name}</td>
                                            <td className="px-6 py-4">{product.model}</td>
                                            <td className="px-6 py-4">{product.brand}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        router.visit(`/update/${product.id}/product`);
                                                    }}
                                                >
                                                    <Pencil color={'#1d4ed8'} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="p-2"
                                                    onClick={() => {
                                                        handleDelete(product.id);
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

                        <DataFilterPagination pagination={pagination} onPageChange={searchProducts} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
