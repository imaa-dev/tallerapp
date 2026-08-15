import { createTechnician } from '@/api/users/usersService';
import InputError from '@/components/input-error';
import InputPhone from '@/components/input-phone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';
import { Technician } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { Save, UserCog } from 'lucide-react';
import React from 'react';
import 'react-phone-input-2/lib/style.css';

export const CreateTechnicianForm: React.FC = () => {
    // posteriormente al crer usuario se le envia las credenciales al tecnico por email
    const { success, error } = useToast();
    const { showLoading, hideLoading } = useLoading();
    const { data, setData, errors, processing, setError } = useForm<Required<Technician>>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const addTechnician = async () => {
        showLoading();
        try {
            const response = await createTechnician(data);
            success(response.message);
            router.visit('/users', {
                method: 'get',
                preserveState: false,
            });
        } catch (err: any) {
            //agregar errores de tipo y errores form request
            if (!err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const status = err.response.status;
            switch (status) {
                case 422:
                    setError(err.response.data.errors ?? {});
                    error(err.response.data.message ?? 'Los datos enviados son inválidos.');
                    break;

                case 401:
                    error('Tu sesión ha expirado.');
                    break;

                case 403:
                    error('No tienes permisos para realizar esta acción.');
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
                addTechnician();
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Datos del técnico
                    </CardTitle>
                    <CardDescription>Información de acceso del técnico.</CardDescription>
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
                        <Label htmlFor="password">
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            className="mt-2"
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} />
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
                        <p className="font-medium">Crear técnico</p>
                        <p className="text-muted-foreground text-sm">Al técnico se le enviarán sus credenciales por email.</p>
                    </div>
                    <Button type="submit" size="lg" tabIndex={4} disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Crear Técnico
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};
