import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientDataProp, ProductDataProp, ServiForm } from '@/types';
import { Save, Settings2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props extends ClientDataProp, ProductDataProp {
    data: ServiForm;
    errors: Partial<Record<keyof ServiForm, string>>;
    processing: boolean;
    onChange: (field: keyof ServiForm, value: ServiForm[keyof ServiForm]) => void;
    onSubmit: FormEventHandler;
}

const selectClassName =
    'mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500';

export default function ServiceBasicForm({ data, errors, processing, onChange, onSubmit, clients, products }: Props) {
    return (
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        Actualizar servicio
                    </CardTitle>
                    <CardDescription>Modificá la fecha de ingreso y los datos asociados al servicio.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="date_entry">Fecha Ingreso Servicio</Label>
                        <Input
                            type="datetime-local"
                            id="date_entry"
                            name="date_entry"
                            className="mt-2"
                            autoComplete="off"
                            value={data.date_entry}
                            onChange={(e) => onChange('date_entry', e.target.value)}
                            required
                        />
                        <InputError message={errors.date_entry} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="product">Producto</Label>
                        <select
                            id="product"
                            className={selectClassName}
                            onChange={(e) => onChange('product_id', Number(e.target.value))}
                            value={data.product_id}
                        >
                            <option value="">Selecciona un producto</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name} {product.brand} {product.model}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.product_id} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="client">Cliente</Label>
                        <select
                            id="client"
                            className={selectClassName}
                            onChange={(e) => onChange('user_id', Number(e.target.value))}
                            value={data.user_id}
                        >
                            <option value="">Selecciona un cliente</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Guardar cambios</p>
                        <p className="text-muted-foreground text-sm">Los datos del servicio serán actualizados.</p>
                    </div>
                    <Button type="submit" size="lg" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Actualizar Datos
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
