import { CreateSparePartsForm } from '@/components/forms/service/CreateSparePartsForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useModal } from '@/context/ModalContextForm';
import { useSpareParts } from '@/context/SparePartsContext';
import { useToast } from '@/context/ToastContext';
import { selectStyle } from '@/styles/reactSelect';
import { useForm } from '@inertiajs/react';
import { Boxes, Plus } from 'lucide-react';
import { FormEventHandler } from 'react';
import Select from 'react-select';

interface ReceiptSpareParts {
    servi_id: number;
    spare_parts: number[];
}
export default function ToSparePartsForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal, openModal } = useModal();
    const { spareParts } = useSpareParts();
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
                    <div className="flex gap-2">
                        <Select
                            isMulti
                            options={spareParts.map((sp) => ({
                                value: String(sp.id),
                                label: `${sp.model} ${sp.brand} $${sp.price}`,
                                color: '#0052CC',
                            }))}
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
                            onClick={() => openModal(() => <CreateSparePartsForm />)}
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
