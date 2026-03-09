import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { ClientDataProp, ProductDataProp, ServiForm } from '@/types';


interface Props extends ClientDataProp, ProductDataProp {
    data: ServiForm;
    errors: Partial<Record<keyof ServiForm, string>>;
    processing: boolean;
    onChange: (field: keyof ServiForm, value: any) => void;
    onSubmit: FormEventHandler;
}

export default function ServiceBasicForm({
    data,
    errors,
    processing,
    onChange,
    onSubmit,
    clients,
    products,
}: Props) {
    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-sidebar-foreground/70 ring-sidebar-ring flex shrink-0 items-center rounded-md pl-7 pt-7 text-base font-medium">
                Actualizar servicio
            </h2>
            <Card className="m-5 mt-10 max-w-xl p-6">
                <SidebarGroupLabel>Datos del servicio</SidebarGroupLabel>

                <div className="group relative z-0 mb-5 w-full">
                    <input
                        type="datetime-local"
                        id="date_entry"
                        name="date_entry"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        autoComplete="off"
                        value={data.date_entry}
                        onChange={(e) => onChange('date_entry', e.target.value)}
                        required
                    />
                    <label
                        htmlFor="date_entry"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Fecha Ingreso Servicio
                    </label>
                    <InputError message={errors.date_entry} />
                </div>

                <div className="group relative z-0 mb-5 w-full">
                    <label htmlFor="product" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Producto
                    </label>
                    <select
                        id="product"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                    <InputError message={errors.product_id} />
                </div>

                <div className="group relative z-0 mb-5 w-full">
                    <label htmlFor="client" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Cliente
                    </label>
                    <select
                        id="client"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

                <div className="grou relative z-0 mt-5 w-full">
                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        <Save /> Actualizar Datos
                    </Button>
                </div>
            </Card>
        </form>
    );
}
