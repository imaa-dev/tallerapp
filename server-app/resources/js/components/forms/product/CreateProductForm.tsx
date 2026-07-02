import React from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { router, useForm, usePage } from '@inertiajs/react';
import { createProduct } from '@/api/product/productsService';
import { CreateProductData, Page, ProductData } from '@/types';
import { useModal } from '@/context/ModalContextForm';
import { useLoading } from '@/context/LoadingContext';

type Props = {
    setProductsData?: React.Dispatch<React.SetStateAction<ProductData[]>>;
};
const CreateProductForm: React.FC<Props> = ({setProductsData}) => {
    const { success, error } = useToast()
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();

    const { data, setData, errors, processing, setError } = useForm<Required<CreateProductData>>({
        name: '',
        brand: '',
        model: ''
    })

    const addProduct = async () => {
        showLoading()
        try {
            const response = await createProduct(data)
            if(typeof setProductsData !== 'undefined' && response.success === true && typeof response.message === 'string' ){
                closeModal();
                setProductsData((prevState) => (response.product !== undefined ? [...prevState, response.product] : prevState));
                success(response.message);
            }
            if(response.success === true && setProductsData === undefined && typeof response.message === 'string'){
            success(response.message)
            router.visit('/product', {
                method: 'get',
                preserveState: false,
            });
        }
        
        } catch (err: any) {
            if (!err.response) {
                // Backend apagado, timeout, sin internet, CORS, etc.
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
        } finally {
            hideLoading();
        }
        
        
    }

    return (
        <React.Fragment>
            <form
                className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
            >
                <SidebarGroupLabel> Crear Producto </SidebarGroupLabel>

                <div className="group relative z-0 mb-5 w-full">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="type_product"
                        id="type_product"
                        required
                        tabIndex={1}
                        autoComplete="type_product"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <label
                        htmlFor="floating_brand"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Tipo de producto  <span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.name} />
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
                        Marca  <span className="text-red-500">*</span>
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
                        htmlFor="floating_model"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Modelo  <span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.model} />
                </div>

                <Button
                    type="button"
                    className="mt-4 w-full"
                    tabIndex={4}
                    disabled={processing}
                    onClick={() => addProduct()}
                >
                    Crear Producto
                </Button>
            </form>
        </React.Fragment>
    )
}

export default CreateProductForm;
