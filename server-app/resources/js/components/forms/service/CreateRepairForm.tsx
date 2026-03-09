import React, { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';

export function CreateRepairForm ({ serviceId } : { serviceId: number }){
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
                if(message){
                    success(message)
                }
            },
            onError: (e) => {
                error(e.message)
                console.log(e, 'Error')
            }
        });

    }

    return (
        <React.Fragment>
            <form onSubmit={submit} className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <SidebarGroupLabel> Reparación </SidebarGroupLabel>
                <div className="group relative z-0 mb-5 w-full">
                    <textarea
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        name="final_note"
                        id="final_note"
                        required
                        tabIndex={1}
                        value={data.final_note}
                        onChange={(e) => setData('final_note', e.target.value)}
                    />
                    <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500">
                        Nota final reparación<span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.final_note} />
                </div>
                <div className="group relative z-0 mb-5 w-full">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="repair_time"
                        id="repair_time"
                        required
                        tabIndex={3}
                        value={data.repair_price}
                        onChange={(e) => setData('repair_price', Number(e.target.value))}
                    />
                    <label
                        htmlFor="repair_time"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Precio<span className="text-red-500">*</span>
                    </label>
                </div>

                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                    Reparar
                </Button>
            </form>
        </React.Fragment>
    );
}
