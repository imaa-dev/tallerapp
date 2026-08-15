import { createSparePart } from '@/api/product/sparePartsService';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useSpareParts } from '@/context/SparePartsContext';
import { useToast } from '@/context/ToastContext';
import { SparePartsData } from '@/types';
import { useForm } from '@inertiajs/react';
import { Boxes, Save } from 'lucide-react';

export const CreateSparePartsForm = ({ onCreated }: { onCreated?: () => void }) => {
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
                const data = response.spare_part;
                setSpareParts((prev) => [...prev, data]);
                success(response.message);
                closeModal();
                onCreated?.();
            }
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
        } finally {
            hideLoading();
        }
    };
    return (
        <form
            className="flex w-full flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                createSpareParts();
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        Agregar pieza de repuesto
                    </CardTitle>
                    <CardDescription>Registra una nueva pieza de repuesto.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="model">
                            Modelo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="model"
                            name="model"
                            className="mt-2"
                            required
                            tabIndex={4}
                            autoComplete="model"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                        />
                        <InputError message={errors.model} />
                    </div>

                    <div>
                        <Label htmlFor="brand">
                            Marca <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="brand"
                            name="brand"
                            className="mt-2"
                            required
                            tabIndex={5}
                            autoComplete="brand"
                            value={data.brand}
                            onChange={(e) => setData('brand', e.target.value)}
                        />
                        <InputError message={errors.brand} />
                    </div>

                    <div>
                        <Label htmlFor="note">
                            Nota Maestro <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="note"
                            name="note"
                            className="mt-2"
                            required
                            tabIndex={6}
                            autoComplete="note"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                        />
                        <InputError message={errors.note} />
                    </div>

                    <div>
                        <Label htmlFor="price">
                            Precio <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            className="mt-2"
                            required
                            tabIndex={7}
                            autoComplete="price"
                            value={data.price}
                            onChange={(e) => setData('price', Number(e.target.value))}
                        />
                        <InputError message={errors.price} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Crear repuesto</p>
                        <p className="text-muted-foreground text-sm">La pieza se agregará al listado de repuestos.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={8} disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Crear pieza de repuesto
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};
