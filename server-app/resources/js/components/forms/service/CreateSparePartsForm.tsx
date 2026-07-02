import React from 'react';
import { SparePartsData } from '@/types';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { createSparePart } from '@/api/product/sparePartsService';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import InputError from '@/components/input-error';
import { useSpareParts } from '@/context/SparePartsContext';

export const CreateSparePartsForm = ({ serviceId }: { serviceId: number }) => {
    const { setSpareParts } = useSpareParts();

    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const { data, setData, errors, processing } = useForm<Required<SparePartsData>>({
        service_id: null,
        model: '',
        brand: '',
        price: 0,
        note: '',
    });
    const createSpareParts = async () => {
        showLoading();
        try {
            const response = await createSparePart(data);
            if (response.success === true && response.spare_part) {
                const data = response.spare_part
                setSpareParts(prev => [...prev, data]);
                success(response.message);
                closeModal();
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
    
    };
    return (
        <React.Fragment>
            <form className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <SidebarGroupLabel> Agregar Pieza de repuesto</SidebarGroupLabel>
                <div className="group relative z-0 mb-5">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="model"
                        id="model"
                        required
                        tabIndex={4}
                        autoComplete="Modelo"
                        value={data.model}
                        onChange={(e) => setData('model', e.target.value)}
                    />
                    <label
                        htmlFor="floating_model"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Modelo <span className="text-red-500"></span>
                    </label>
                    <InputError message={errors.model} />
                </div>
                <div className="group relative z-0 mb-5">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="brand"
                        id="brand"
                        required
                        tabIndex={5}
                        autoComplete="brand"
                        value={data.brand}
                        onChange={(e) => setData('brand', e.target.value)}
                    />

                    <label
                        htmlFor="floating_brand"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Marca <span className="text-red-500"></span>
                    </label>
                    <InputError message={errors.brand} />
                </div>
                <div className="group relative z-0 mb-5">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="note"
                        id="note"
                        required
                        tabIndex={6}
                        autoComplete="note"
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                    />

                    <label
                        htmlFor="floating_brand"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Nota Maestro <span className="text-red-500"></span>
                    </label>
                    <InputError message={errors.note} />
                </div>
                <div className="group relative z-0 mb-5">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="price"
                        id="price"
                        required
                        tabIndex={7}
                        autoComplete="price"
                        value={data.price}
                        onChange={(e) => setData('price', Number(e.target.value))}
                    />

                    <label
                        htmlFor="floating_brand"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Precio <span className="text-red-500"></span>
                    </label>
                    <InputError message={errors.price} />
                </div>
                <Button type="button" className="mt-4 w-full" tabIndex={8} disabled={processing} onClick={() => createSpareParts()}>
                    Crear pieza de repuesto
                </Button>
            </form>
        </React.Fragment>
    );
};
