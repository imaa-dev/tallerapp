import { Head, useForm } from '@inertiajs/react';
import { Check, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';

type WorkshopType = {
    id: number;
    name: string;
};

interface RegisterProps {
    workshop_types: WorkshopType[];
}

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nameOrganization: string;
    workshop_type_id: number | '';
};

const STEPS: { title: string; description: string }[] = [
    { title: '¿Quién está creando la cuenta?', description: 'Ingresa el nombre del administrador o cliente que la crea.' },
    { title: '¿Cómo se llama tu negocio?', description: 'Ingresa el nombre del taller o negocio.' },
    { title: '¿Qué tipo de taller es?', description: 'Selecciona el tipo de taller para configurar tu espacio.' },
    { title: 'Crea tu cuenta', description: 'Ingresa tu email y una contraseña segura.' },
];

export default function Register({ workshop_types }: RegisterProps) {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nameOrganization: '',
        workshop_type_id: '',
    });

    const next = () => {
        if (step === 1) {
            if (!data.name.trim()) {
                setError('name', 'Ingresa tu nombre');
                return;
            }
        } else if (step === 2) {
            if (!data.nameOrganization.trim()) {
                setError('nameOrganization', 'Ingresa el nombre de tu negocio');
                return;
            }
        } else if (step === 3) {
            if (data.workshop_type_id === '') {
                setError('workshop_type_id', 'Selecciona el tipo de taller');
                return;
            }
        }
        setStep(step + 1);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title={STEPS[step - 1].title} description={STEPS[step - 1].description}>
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit} autoComplete="off">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        {STEPS.map((s, i) => {
                            const num = i + 1;
                            const active = num === step;
                            const done = num < step;
                            return (
                                <div key={s.title} className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            'h-2.5 w-2.5 rounded-full transition-colors',
                                            active ? 'bg-primary' : done ? 'bg-primary/50' : 'bg-muted'
                                        )}
                                    />
                                    {num < STEPS.length && (
                                        <div className={cn('h-px w-8', done ? 'bg-primary/50' : 'bg-muted')} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <span className="text-muted-foreground text-xs">
                        Paso {step} de {STEPS.length}
                    </span>
                </div>

                {step === 1 && (
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                clearErrors('name');
                            }}
                            disabled={processing}
                            placeholder="Nombre completo"
                        />
                        <InputError message={errors.name} />
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-2">
                        <Label htmlFor="nameOrganization">Nombre del negocio</Label>
                        <Input
                            id="nameOrganization"
                            type="text"
                            required
                            autoFocus
                            autoComplete="organization"
                            value={data.nameOrganization}
                            onChange={(e) => {
                                setData('nameOrganization', e.target.value);
                                clearErrors('nameOrganization');
                            }}
                            disabled={processing}
                            placeholder="Ej: Taller Mecánico El Maestro"
                        />
                        <InputError message={errors.nameOrganization} />
                    </div>
                )}

                {step === 3 && (
                    <div className="grid gap-2">
                        <div className="grid gap-2">
                            {workshop_types.map((type) => {
                                const selected = data.workshop_type_id === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setData('workshop_type_id', type.id);
                                            clearErrors('workshop_type_id');
                                        }}
                                        className={cn(
                                            'flex items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors',
                                            selected ? 'border-primary bg-primary/5' : 'border-input hover:bg-muted'
                                        )}
                                    >
                                        {type.name}
                                        {selected && <Check className="text-primary h-4 w-4" />}
                                    </button>
                                );
                            })}
                        </div>
                        <InputError message={errors.workshop_type_id} />
                    </div>
                )}

                {step === 4 && (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@ejemplo.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Contraseña"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirmar contraseña"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                )}

                <div className="grid gap-3">
                    {step < STEPS.length ? (
                        <Button type="button" className="w-full" onClick={next}>
                            Continuar
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Crear Cuenta
                        </Button>
                    )}
                    {step > 1 && (
                        <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(step - 1)} disabled={processing}>
                            Atrás
                        </Button>
                    )}
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    ¿Tienes una cuenta?{' '}
                    <TextLink href={route('login')}>
                        Iniciar sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
