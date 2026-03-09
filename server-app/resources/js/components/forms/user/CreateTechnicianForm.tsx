import React from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import InputError from '@/components/input-error';
import InputPhone from '@/components/input-phone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { router, useForm } from '@inertiajs/react';
import 'react-phone-input-2/lib/style.css'
import { Technician } from '@/types';
import { useLoading } from '@/context/LoadingContext';
import { createTechnician } from '@/api/users/usersService';


export const CreateTechnicianForm: React.FC<Props> = () => {
    // posteriormente al crer usuario se le envia las credenciales al tecnico por email
    const { success, error } = useToast()
    const { showLoading, hideLoading } = useLoading();
    const { data, setData,  errors, processing, setError } = useForm<Required<Technician>>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        password: ''
    })
    const addClient = async () => {
        showLoading()
        const response = await createTechnician(data)
        hideLoading()
        if(response.code === 201){
            success(response.message);
            router.visit('/users');
        }
        if(response.code === 422 && typeof response.errors === 'object'){
            setError(response.errors)
            error('Error de validación de datos')
        }
        if(response.code === 'ERR_NETWORK'){
            error('Error de conexión')
        }
        if(response.code === 'ERR_BAD_RESPONSE'){
            error('Error en el servidor')
        }
        if(response.code === 500){
            error(response.message)
        }
    }
    return (
        <React.Fragment>
            <form
                className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800"
            >
                <SidebarGroupLabel> Crear Tecnico Master </SidebarGroupLabel>
                <div className="w-full group relative z-0 mb-5">
                    <input
                        type="text"
                        name="name_client"
                        id="name_client"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <label
                        htmlFor="floating_name"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.name} />
                </div>
                <div className="group relative z-0 mb-5 w-full">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="client_email"
                        id="client_email"
                        tabIndex={2}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <label
                        htmlFor="floating_email"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Email
                    </label>
                    <InputError message={errors.email} />
                </div>
                <div className="group relative z-0 mb-5 w-full" >
                    <input 
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="password"
                        name="password"
                        id="password"
                        tabIndex={3}
                        autoComplete="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <label
                        htmlFor="password_email"
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Password
                    </label>
                </div>
                <div className="group relative z-0 mb-5 w-full">
                    <label
                        htmlFor="floating_cel"
                        className="absolute  origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                    >
                        Celular <span className="text-red-500">*</span>
                    </label>
                    <InputPhone data={data} setData={setData} />
                    <InputError message={errors.phone} />
                </div>
                <Button
                    type="button"
                    className="mt-4 w-full"
                    tabIndex={3}
                    disabled={processing}
                    onClick={() => addClient()}
                >
                    Crear Tecnico
                </Button>
            </form>
        </React.Fragment>
    )
}
