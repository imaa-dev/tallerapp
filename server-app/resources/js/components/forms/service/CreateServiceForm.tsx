import React, { ChangeEvent, FormEventHandler, useContext, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { handleImageUploadMultiple } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';
import { ClientDataProp, Page, ProductDataProp, ServiDataForm } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useModal } from '@/context/ModalContextForm';
import CreateProductForm from '@/components/forms/product/CreateProductForm';
import { CreateClientForm } from '@/components/forms/client/CreateClientForm';
import { FormContext } from '@/context/FormContext';
const appUrl = import.meta.env.VITE_APP_URL;

const CreateServiceForm = ({clients, products}: ClientDataProp & ProductDataProp) => {
    const {success, error} = useToast()
    const [reason, setReason] = useState<string>('');
    const [clientsData, setClientsData] = useState(clients);
    const [productsData, setProductsData] = useState(products);
    const [uploadImage, setUploadImage] = useState<string[]>([]);
    const {showLoading, hideLoading} = useLoading();
    const {openModal} = useModal();
    const {state, dispatch} = useContext(FormContext);

    const handleImageChange = (files: File[]) => {
        const urls = Array.from(files).map((file) => URL.createObjectURL(file));
        setUploadImage((prev) => [...prev, ...urls]);
    }
    const page: Page = usePage();
    const { post, data, setData, errors, processing } = useForm<Required<ServiDataForm>>({
        organization_id: page.props.organization.id,
        product_id: state.product_id,
        user_id: state.user_id,
        date_entry: state.date_entry,
        reason_notes: state.reason_notes,
        status_id: 1,
        file: state.file,
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch({
            type: 'SET_FIELD',
            field: e.target.name as keyof typeof state,
            value: e.target.value,
        });
    };

    const handleChangeReasonNote = (reason: string) => {
        dispatch({
            type: 'SET_FIELD',
            field: "reason_notes" as keyof typeof state,
            value: [...data.reason_notes, { reason_note: reason }]
        })
    }
    const removeReasonNotes = (index: number) => {
        dispatch({ type: 'REMOVE_REASON_NOTE', index });
    }

    const submit:FormEventHandler = (e) => {
        e.preventDefault();
        post('/create/service', {
            onSuccess: (page) => {
                dispatch({ type: 'CLEAN_REASON_NOTE' });
                dispatch({ type: 'CLEAN_FORM' })
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                if (message) {
                    success(message);
                }
            },
            onError: (e) => {
                dispatch({ type: 'CLEAN_REASON_NOTE' });
                dispatch({ type: 'CLEAN_FORM' })
                error(e.message)
                console.log(e,'ERROR POST')
            }
        })
    }
    return (
        <React.Fragment>
            <form onSubmit={submit}>
                <h2 className="text-sidebar-foreground/70 ring-sidebar-ring flex shrink-0 items-center rounded-md pt-7 pl-7 text-base font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0">
                    <Save /> Crear Servicio
                </h2>
                <Card className="m-5 mt-10 max-w-xl p-6">
                    <SidebarGroupLabel> Datos del servicio </SidebarGroupLabel>
                    <div className="group relative z-0 mb-5 w-full">
                        <input
                            tabIndex={0}
                            type="datetime-local"
                            name="date_entry"
                            id="date_entry"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                            autoComplete="off"
                            value={data.date_entry}
                            onChange={(e) => {
                                handleChange(e);
                                setData('date_entry', e.target.value);
                            }}
                            required
                        />
                        <label
                            htmlFor="date_entry"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                        >
                            Fecha Ingreso Servicio <span className="text-red-500">*</span>
                        </label>
                        <InputError message={errors.date_entry} />
                    </div>
                    <div className="group relative z-0 mb-5 w-full">
                        <label
                            htmlFor="products"
                            className="absolute -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                        >
                            Producto <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <select
                                id="product"
                                name="product_id"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                onChange={(e) => {
                                    handleChange(e);
                                    setData('product_id', Number(e.target.value));
                                }}
                                value={data.product_id}
                            >
                                <option value="">Selecciona un producto</option>
                                {productsData.map((product, index) => (
                                    <option key={index} value={product.id}>
                                        {product.name} {product.brand} {product.model}
                                    </option>
                                ))}
                            </select>
                            <Button type="button" className="ml-3" onClick={() => openModal( () => (<CreateProductForm setProductsData={setProductsData} />) )}>
                                <Plus />
                            </Button>
                        </div>
                        <InputError message={errors.product_id} />
                    </div>

                    <div className="group relative z-0 mb-5 w-full">
                        <label
                            htmlFor="clients"
                            className="absolute -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                        >
                            Cliente <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <select
                                id="client"
                                name="client"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                onChange={(e) => {
                                    handleChange(e)
                                    setData('user_id', Number(e.target.value));
                                }}
                                value={data.user_id}
                            >
                                <option value="">Selecciona un cliente</option>
                                {clientsData.map((client, index) => (
                                    <option key={index} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                            <Button type="button" className="ml-3" onClick={() => openModal( () => (<CreateClientForm setClientsData={setClientsData} />) )}>
                                <Plus />
                            </Button>
                        </div>
                    </div>
                </Card>
                <Card className="m-5 mt-10 max-w-xl p-6">
                    <SidebarGroupLabel> Detalles del ingreso </SidebarGroupLabel>
                    <div className="group relative z-0 mb-5 w-full">
                        <input
                            type="text"
                            name="reason_notes"
                            id="reason"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                           
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                            }}
                        />
                        <label
                            htmlFor="reason"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                        >
                            Agregar detalle ingreso de servicio <span className="text-red-500">*</span>
                        </label>
                    </div>
                    <Button
                        type="button"
                        onClick={async () => {
                            if (reason.trim() === '') {
                                error('El detalle de ingreso no puede ir vacio');
                                return;
                            }
                            setData('reason_notes', [...data.reason_notes, { reason_note: reason }]);
                            handleChangeReasonNote(reason)
                            setReason('');
                        }}
                        className="mt-4 w-full"
                    >
                        <Plus /> Agregar Detalle
                    </Button>
                    {data.reason_notes.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-white">Detalles agregados:</h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800 dark:text-white">
                                {data.reason_notes.map((item, index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        {item.reason_note}
                                        <button
                                            type="button"
                                            className="ml-2 text-xs text-red-500"
                                            onClick={() => {
                                                const updated = data.reason_notes.filter((_, i) => i !== index);
                                                setData('reason_notes', updated);
                                                removeReasonNotes(index)
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
                <Card className="m-5 mt-5 max-w-xl p-6">
                    <SidebarGroupLabel> Fotos y registros del servicio </SidebarGroupLabel>
                    {uploadImage.length > 0 ? (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            {uploadImage.map((src, index) => (
                                <div key={index} className="relative">
                                    <img src={src} alt={`preview-${index}`} className="h-28 w-full rounded border object-cover" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="group relative flex items-center justify-center">
                            <img className="w-50" src={`${appUrl}/images/max-img.png`} alt="Upload Image" />
                        </div>
                    )}
                    <div className="grou relative z-0 mb-5 w-full">
                        <input
                            type="file"
                            name="file_servi[]"
                            id="file_servi"
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                            multiple
                            tabIndex={5}
                            autoComplete="file"
                            onChange={(e) => {
                                setUploadImage([]);
                                showLoading();
                                const file = e.target.files;
                                if (file) {
                                    handleImageUploadMultiple(file)
                                        .then((res) => {
                                            setData('file', res);
                                            handleImageChange(res);
                                            hideLoading();
                                        })
                                        .catch((err) => {
                                            error('Error al comprimir la imagen');
                                            console.log('ONCHANGE_INPUT_FILE_ERROR', err);
                                            hideLoading();
                                        });
                                }
                            }}
                        />
                        <label
                            htmlFor="file"
                            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                        >
                            Fotos
                        </label>
                        <InputError message={errors.file} />
                    </div>
                </Card>
                <div className="grou relative z-0 mt-5 w-full p-5">
                    <Button type="submit" className="w-full p-8" tabIndex={6} disabled={processing}>
                        <Save /> Crear Servicio
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
}
export default CreateServiceForm;
