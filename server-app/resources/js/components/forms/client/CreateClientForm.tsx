import { createClient } from '@/api/clients/clientsService';
import InputError from '@/components/input-error';
import InputPhone from '@/components/input-phone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { Client, CreateClientData } from '@/types';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Save, UserPlus } from 'lucide-react';
import React from 'react';
import 'react-phone-input-2/lib/style.css';

type Props = {
    setClientsData?: React.Dispatch<React.SetStateAction<Client[]>>;
    onCreated?: () => void;
};
export const CreateClientForm: React.FC<Props> = ({ setClientsData, onCreated }) => {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const { data, setData, errors, processing, setError } = useForm<Required<CreateClientData>>({
        name: '',
        email: '',
        phone: '',
    });
    const addClient = async () => {
        showLoading();
        try {
            const response = await createClient(data);
            if (response.success === true && typeof onCreated === 'function') {
                closeModal();
                onCreated();
                success(response.message);
            }
            if (typeof setClientsData !== 'undefined' && response.success === true) {
                closeModal();
                setClientsData?.((prevState) => (response.client !== undefined ? [...prevState, response.client] : prevState));
                success(response.message);
            }
            if (response.success === true && setClientsData === undefined && typeof onCreated === 'undefined') {
                success(response.message);
                router.visit('/users', {
                    method: 'get',
                    preserveState: false,
                });
            }
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const { status, data } = err.response;
            switch (status) {
                case 409:
                    error(data?.message ?? 'No se pudo eliminar el registro.');
                    break;

                case 422:
                    setError(data?.errors ?? {});
                    error(data?.message ?? 'Los datos enviados son inválidos.');
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
                addClient();
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Datos del cliente
                    </CardTitle>
                    <CardDescription>Información de contacto del cliente.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="name_client">
                            Nombre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name_client"
                            name="name_client"
                            className="mt-2"
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="client_email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="client_email"
                            name="client_email"
                            type="email"
                            className="mt-2"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="floating_cel">
                            Celular <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2">
                            <InputPhone data={data} setData={setData} />
                        </div>
                        <InputError message={errors.phone} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="font-medium">Crear cliente</p>
                        <p className="text-muted-foreground text-sm">El cliente se registrará en tu organización.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={3} disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Crear Cliente
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};
