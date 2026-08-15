import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useForm } from '@inertiajs/react';
import { Save, Wrench } from 'lucide-react';
import { FormEventHandler } from 'react';

export function CreateRepairForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { post, processing, data, setData, errors } = useForm({
        service_id: serviceId,
        repair_price: 0,
        final_note: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/repair/service', {
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
                        <Wrench className="h-5 w-5" />
                        Reparación
                    </CardTitle>
                    <CardDescription>Registrá los detalles finales de la reparación del servicio.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="final_note">
                            Nota final reparación <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            id="final_note"
                            name="final_note"
                            required
                            tabIndex={1}
                            value={data.final_note}
                            onChange={(e) => setData('final_note', e.target.value)}
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 mt-2 flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        <InputError message={errors.final_note} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="repair_price">
                            Precio <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            name="repair_price"
                            id="repair_price"
                            required
                            tabIndex={2}
                            className="mt-2"
                            value={data.repair_price}
                            onChange={(e) => setData('repair_price', Number(e.target.value))}
                        />
                        <InputError message={errors.repair_price} className="mt-2" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Finalizar reparación</p>
                        <p className="text-muted-foreground text-sm">El servicio quedará listo para ser entregado.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={3} disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Reparar
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
