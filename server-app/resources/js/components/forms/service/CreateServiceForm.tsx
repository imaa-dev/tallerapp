import { CreateClientForm } from '@/components/forms/client/CreateClientForm';
import CreateProductForm from '@/components/forms/product/CreateProductForm';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceStatus } from '@/constants/service-status';
import { FormContext } from '@/context/FormContext';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { handleImageUploadMultiple } from '@/lib/utils';
import { ClientDataProp, Page, ProductDataProp, ServiDataForm } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { ImagePlus, ListPlus, Package, Plus, Save, Trash2, UserRound } from 'lucide-react';
import { ChangeEvent, FormEventHandler, useContext, useState } from 'react';
const appUrl = import.meta.env.VITE_APP_URL;

const selectClassName =
    'border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]';

const CreateServiceForm = ({ clients, products }: ClientDataProp & ProductDataProp) => {
    const { success, error } = useToast();
    const [issue, setIssue] = useState<string>('');
    const [clientsData, setClientsData] = useState(clients);
    const [productsData, setProductsData] = useState(products);
    const [uploadImage, setUploadImage] = useState<string[]>([]);
    const { showLoading, hideLoading } = useLoading();
    const { openModal } = useModal();
    const { state, dispatch } = useContext(FormContext);
    const handleImageChange = (files: File[]) => {
        const urls = Array.from(files).map((file) => URL.createObjectURL(file));
        setUploadImage((prev) => [...prev, ...urls]);
    };
    const page: Page = usePage();
    const { post, data, setData, errors, processing } = useForm<Required<ServiDataForm>>({
        organization_id: page.props.organization.id,
        product_id: state.product_id,
        user_id: state.user_id,
        date_entry: state.date_entry,
        issues: state.issues,
        status_id: ServiceStatus.Reception,
        file: state.file,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch({
            type: 'SET_FIELD',
            field: e.target.name as keyof typeof state,
            value: e.target.value,
        });
    };

    const handleChangeIssue = (issue: string) => {
        dispatch({
            type: 'SET_FIELD',
            field: 'issues' as keyof typeof state,
            value: [...data.issues, { issue }],
        });
    };
    const removeIssue = (index: number) => {
        dispatch({ type: 'REMOVE_ISSUE', index });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/create/service', {
            onSuccess: (page) => {
                dispatch({ type: 'CLEAN_ISSUES' });
                dispatch({ type: 'CLEAN_FORM' });
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                const flash = (
                    page.props as {
                        flash?: {
                            error?: string;
                            error_code?: string;
                        };
                    }
                ).flash;

                if (message) {
                    success(message);
                }
                if (flash?.error_code === 'ORGANIZATION_SUSPENDED') {
                    error(flash.error ?? 'Ha ocurrido un error');
                }
            },
            onError: () => {
                dispatch({ type: 'CLEAN_ISSUES' });
                dispatch({ type: 'CLEAN_FORM' });
            },
        });
    };
    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            {/* DATOS DEL SERVICIO */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Datos del servicio
                    </CardTitle>
                    <CardDescription>Información general del ingreso.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="date_entry">
                            Fecha ingreso servicio <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="date_entry"
                            type="datetime-local"
                            name="date_entry"
                            className="mt-2"
                            autoComplete="off"
                            value={data.date_entry}
                            onChange={(e) => {
                                handleChange(e);
                                setData('date_entry', e.target.value);
                            }}
                            required
                        />
                        <InputError message={errors.date_entry} />
                    </div>

                    <div>
                        <Label htmlFor="product">
                            Producto <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex gap-2">
                            <select
                                id="product"
                                name="product_id"
                                className={selectClassName}
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
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                title="Crear producto"
                                onClick={() => openModal(() => <CreateProductForm setProductsData={setProductsData} />)}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <InputError message={errors.product_id} />
                    </div>

                    <div>
                        <Label htmlFor="user_id">
                            Cliente <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2 flex gap-2">
                            <select
                                id="user_id"
                                name="user_id"
                                className={selectClassName}
                                onChange={(e) => {
                                    handleChange(e);
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
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                title="Crear cliente"
                                onClick={() => openModal(() => <CreateClientForm setClientsData={setClientsData} />)}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <InputError message={errors.user_id} />
                    </div>
                </CardContent>
            </Card>

            {/* DETALLES DEL INGRESO */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListPlus className="h-5 w-5" />
                        Detalles del ingreso
                    </CardTitle>
                    <CardDescription>Agrega las novedades o fallas reportadas.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            name="issue"
                            id="issue"
                            placeholder="Ej: Pantalla rota, batería dañada..."
                            value={issue}
                            onChange={(e) => {
                                setIssue(e.target.value);
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                if (issue.trim() === '') {
                                    error('El detalle de ingreso no puede ir vacio');
                                    return;
                                }
                                setData('issues', [...data.issues, { issue }]);
                                handleChangeIssue(issue);
                                setIssue('');
                            }}
                        >
                            <Plus /> Agregar
                        </Button>
                    </div>
                    <InputError message={errors.issues} />

                    {data.issues.length > 0 && (
                        <ul className="space-y-2">
                            {data.issues.map((item, index) => (
                                <li key={index} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                                    <span className="flex items-center gap-2">
                                        <UserRound className="text-muted-foreground h-4 w-4" />
                                        {item.issue}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive h-8 w-8"
                                        onClick={() => {
                                            const updated = data.issues.filter((_, i) => i !== index);
                                            setData('issues', updated);
                                            removeIssue(index);
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* FOTOS Y REGISTROS */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImagePlus className="h-5 w-5" />
                        Fotos y registros del servicio
                    </CardTitle>
                    <CardDescription>Adjunta fotos del estado del equipo.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Input
                        type="file"
                        name="file_servi[]"
                        id="file_servi"
                        multiple
                        tabIndex={5}
                        autoComplete="file"
                        accept="image/*"
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
                    <InputError message={errors.file} />

                    {uploadImage.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {uploadImage.map((src, index) => (
                                <img key={index} src={src} alt={`preview-${index}`} className="h-28 w-full rounded-lg border object-cover" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center rounded-lg border border-dashed py-10">
                            <img className="w-40" src={`${appUrl}/images/max-img.png`} alt="Upload Image" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* FOOTER */}
            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Crear servicio</p>
                        <p className="text-muted-foreground text-sm">El servicio se registrará como recepcionado.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={6} disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Crear Servicio
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};
export default CreateServiceForm;
