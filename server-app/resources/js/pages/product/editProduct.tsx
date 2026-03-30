import type { BreadcrumbItem, ProductData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import ButtonBack from '@/components/button-back';
import { useToast } from '@/context/ToastContext';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Producto',
        href: '/product',
    },
    {
        title: 'Actualizar ',
        href: '/product',
    },

];

interface ProductDataProps {
    id: number;
    name: string;
    brand: string,
    model: string,
    file: File[] | null
}

interface Product {
    product: ProductData
}
export default function EditProduc({product}: Product) {
    const { success, error } = useToast()
    const { data, setData, post, errors, processing } = useForm<Required<ProductDataProps>>({
        id: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        file: null
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/update/product', {
            onSuccess: ((page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if(message){
                    success(message);
                }
            }),
            onError: ((e) => {
                error(e.message)
            })
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Productos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <ButtonBack />
            <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <form
                        className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
                        onSubmit={submit}
                    >
                        <SidebarGroupLabel> Actualizar Producto </SidebarGroupLabel>
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                type="text"
                                name="name_product"
                                id="name_product"
                                required
                                tabIndex={1}
                                autoComplete="name_product"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <label
                                htmlFor="floating_brand"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Tipo producto
                            </label>
                            <InputError message={errors.brand} />
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                type="text"
                                name="brand_product"
                                id="brand_product"
                                required
                                tabIndex={2}
                                autoComplete="marca"
                                value={data.brand}
                                onChange={(e) => setData('brand', e.target.value)}
                            />
                            <label
                                htmlFor="floating_brand"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Marca
                            </label>
                            <InputError message={errors.brand} />
                        </div>
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                type="text"
                                name="model_product"
                                id="model_product"
                                required
                                tabIndex={3}
                                autoComplete="model"
                                value={data.model}
                                onChange={(e) => setData('model', e.target.value)}
                            />
                            <label
                                htmlFor="floating_brand"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Modelo
                            </label>
                            <InputError message={errors.model} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            tabIndex={4}
                            disabled={processing}
                        >
                            Actualizar Producto
                        </Button>
                    </form>
                </div>
            </div>
            </div>
        </AppLayout>
    )
}
