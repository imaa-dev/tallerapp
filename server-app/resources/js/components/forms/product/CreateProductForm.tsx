import { createProduct } from '@/api/product/productsService';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { CreateProductData, ProductData } from '@/types';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { PackagePlus, Save } from 'lucide-react';
import React from 'react';

type Props = {
    setProductsData?: React.Dispatch<React.SetStateAction<ProductData[]>>;
    onCreated?: () => void;
};
const CreateProductForm: React.FC<Props> = ({ setProductsData, onCreated }) => {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();

    const { data, setData, errors, processing, setError } = useForm<Required<CreateProductData>>({
        name: '',
        brand: '',
        model: '',
    });

    const addProduct = async () => {
        showLoading();
        try {
            const response = await createProduct(data);
            if (response.success === true && typeof onCreated === 'function') {
                closeModal();
                onCreated();
                if (typeof response.message === 'string') {
                    success(response.message);
                }
            } else if (typeof setProductsData !== 'undefined' && response.success === true && typeof response.message === 'string') {
                closeModal();
                setProductsData((prevState) => (response.product !== undefined ? [...prevState, response.product] : prevState));
                success(response.message);
            } else if (
                response.success === true &&
                typeof setProductsData === 'undefined' &&
                typeof onCreated === 'undefined' &&
                typeof response.message === 'string'
            ) {
                success(response.message);
                router.visit('/product', {
                    method: 'get',
                    preserveState: false,
                });
            }
        } catch (err: unknown) {
            if (!axios.isAxiosError(err)) {
                error('Ha ocurrido un error inesperado.');
                return;
            }

            if (!err.response) {
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
                    setError(data?.errors ?? {});
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
        } finally {
            hideLoading();
        }
    };

    return (
        <form
            className="flex w-full flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                addProduct();
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PackagePlus className="h-5 w-5" />
                        Datos del producto
                    </CardTitle>
                    <CardDescription>Información general del producto.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="type_product">
                            Tipo de producto <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="type_product"
                            name="type_product"
                            className="mt-2"
                            required
                            tabIndex={1}
                            autoComplete="type_product"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="brand_product">
                            Marca <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="brand_product"
                            name="brand_product"
                            className="mt-2"
                            required
                            tabIndex={2}
                            autoComplete="marca"
                            value={data.brand}
                            onChange={(e) => setData('brand', e.target.value)}
                        />
                        <InputError message={errors.brand} />
                    </div>

                    <div>
                        <Label htmlFor="model_product">
                            Modelo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="model_product"
                            name="model_product"
                            className="mt-2"
                            required
                            tabIndex={3}
                            autoComplete="model"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                        />
                        <InputError message={errors.model} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Crear producto</p>
                        <p className="text-muted-foreground text-sm">El producto se registrará en tu organización.</p>
                    </div>
                    <Button type="button" size="lg" tabIndex={4} disabled={processing} onClick={() => addProduct()}>
                        <Save className="mr-2 h-4 w-4" />
                        Crear Producto
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default CreateProductForm;
