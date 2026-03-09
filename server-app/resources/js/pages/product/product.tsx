import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ProductData } from '@/types';
import { Head, router } from '@inertiajs/react';
import ButtonAdd from '@/components/button-add';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/api/product/productsService';
import { useConfirmDialog } from '@/context/ModalContext';
import { useEffect, useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { AskContent } from '@/components/ask-content';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Productos',
        href: '/product',
    }
];
interface ProductDataProp {
    notOrganization: boolean;
    products: ProductData[];
}
export default function Product({products, notOrganization}: ProductDataProp){
    const [ modalShow ] = useState<boolean>(notOrganization)
    const [ productsShow, setProductsShow ] = useState(products)
    const { showConfirm } = useConfirmDialog();
    const { success, error } = useToast();
    const { openModal } = useModal();
    const handleDelete = (productId: number) => {
        showConfirm({
            title: "Deseas eliminar el producto",
            onConfirm: () => handleRemoveProduct(productId)
        })
    }
    const handleRemoveProduct = async (id: number) => {
        const response = await deleteProduct(id);
        if (response.code === 200) {
            success(response.message);
            setProductsShow(prev => prev.filter(pro => pro.id !== id))
        } else {
            error(response.message);
        }
    }

    useEffect(() => {
        if(modalShow){
            openModal( () => (<AskContent></AskContent>)  );
        }
    }, [modalShow])

    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos" />
                <ButtonAdd route="/create/product" />
                <div className="flex h-full flex-1 flex-col items-center gap-4 px-4 sm:px-5">
                    <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.model}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.brand}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            className="p-2"
                                            onClick={() => {
                                                router.visit(`/update/${product.id}/product`)
                                            }}
                                        >
                                            <Pencil color={'#1d4ed8'} />
                                        </button>

                                        <button
                                            type="button"
                                            className="p-2"
                                            onClick={() => {
                                                handleDelete(product.id)
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
                </div>
        </AppLayout>
    )
}
