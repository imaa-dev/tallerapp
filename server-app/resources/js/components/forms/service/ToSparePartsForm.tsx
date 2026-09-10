import { CreateSparePartsForm } from '@/components/forms/service/CreateSparePartsForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useSpareParts } from '@/context/SparePartsContext';
import { useToast } from '@/context/ToastContext';
import { selectStyle } from '@/styles/reactSelect';
import { useForm } from '@inertiajs/react';
import { Boxes, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import Select from 'react-select';
import { ServiData, ListSparePartsData } from '@/types';
import axios from 'axios';

interface ReceiptSpareParts {
    servi_id: number;
    spare_parts: number[];
}
export default function ToSparePartsForm({ serviceId, service }: { serviceId: number; service?: ServiData }) {
    const { success, error } = useToast();
    const { closeModal, openModal } = useModal();
    const { spareParts } = useSpareParts();
    const { showLoading, hideLoading } = useLoading();
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [serviceSpareParts, setServiceSpareParts] = useState(service?.spareparts ?? []);
    const { post, setData, processing } = useForm<Required<ReceiptSpareParts>>({
        servi_id: serviceId,
        spare_parts: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/create-spare-parts-notificate', {
            onSuccess: (page) => {
                const message = (page.props as { flash?: { message?: string } }).flash?.message;
                closeModal();
                if (message) {
                    success(message);
                }
            },
            onError: (e) => {
                error(e.message);
                console.log(e, 'Error');
            },
        });
    };

    const handleRemove = async (sparePartId: number) => {
        if (removingId !== null) {
            return;
        }
        setRemovingId(sparePartId);
        showLoading();
        try {
            const response = await axios.post('/remove-spare-part/service', {
                servi_id: serviceId,
                spare_part_id: sparePartId,
            });
            setServiceSpareParts((prev) => prev.filter((sp) => sp.id !== sparePartId));
            success('Repuesto quitado del servicio');
            if ((response.data as { flash?: { message?: string } })?.flash?.message) {
                success((response.data as { flash?: { message?: string } }).flash!.message as string);
            }
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            error(err.response.data?.message ?? 'Ha ocurrido un error.');
        } finally {
            setRemovingId(null);
            hideLoading();
        }
    };

    const options = spareParts
        .filter((sp) => {
            const bound = (sp as ListSparePartsData & { servi_id?: number | null }).servi_id ?? sp.service_id;
            return bound === null || bound === undefined;
        })
        .map((sp) => ({
            value: String(sp.id),
            label: `${sp.model} ${sp.brand} $${sp.price}`,
            color: '#0052CC',
        }));

    return (
        <form className="flex w-full flex-col gap-4" onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        Repuestos
                    </CardTitle>
                    <CardDescription>Seleccioná las piezas de repuesto utilizadas o creá una nueva.</CardDescription>
                </CardHeader>

                <CardContent>
                    {serviceSpareParts.length > 0 && (
                        <div className="mb-4 space-y-2">
                            {serviceSpareParts.map((sp) => (
                                <div
                                    key={sp.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {sp.brand} - {sp.model}
                                        </p>
                                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            ${Number(sp.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(sp.id)}
                                        className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                                        title="Quitar repuesto"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Select
                            isMulti
                            options={options}
                            className="w-full"
                            tabIndex={1}
                            styles={selectStyle}
                            onChange={(selected) =>
                                setData(
                                    'spare_parts',
                                    selected.map((item) => Number(item.value)),
                                )
                            }
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Crear repuesto"
                            onClick={() => openModal(() => <CreateSparePartsForm onCreated={() => undefined} />)}
                        >
                            <Plus />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Agregar repuestos</p>
                        <p className="text-muted-foreground text-sm">Se notificará al cliente sobre los repuestos.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={2} disabled={processing}>
                        <Boxes className="mr-2 h-4 w-4" />
                        Agregar repuestos
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}