import AppLogoIcon from '@/components/app-logo-icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ClipboardList, LayoutDashboard, Menu, Rocket, Stethoscope, UserCog, Users, Wrench, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Características', href: '#caracteristicas' },
    { label: 'Cómo funciona', href: '#como-funciona' },
];

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
}

const features: Feature[] = [
    {
        title: 'Gestión de clientes',
        description: 'Fichas completas con contacto, vehículos e historial de servicios.',
        icon: Users,
    },
    {
        title: 'Órdenes de trabajo',
        description: 'Registra, diagnostica y sigue cada orden hasta la entrega.',
        icon: ClipboardList,
    },
    {
        title: 'Gestión de técnicos',
        description: 'Asigna trabajos y controla la carga de tu equipo.',
        icon: UserCog,
    },
    {
        title: 'Seguimiento de servicios',
        description: 'Estado en tiempo real de cada servicio del taller.',
        icon: Stethoscope,
    },
];

const steps = [
    {
        title: 'Registra tu taller',
        description: 'Crea tu cuenta, tu organización y carga tus servicios.',
    },
    {
        title: 'Gestiona tus servicios',
        description: 'Recibe vehículos, diagnostica y aprueba costos y repuestos.',
    },
    {
        title: 'Entrega y realiza seguimiento',
        description: 'Marca la entrega y consulta el historial cuando lo necesites.',
    },
];

const serviceStatus = [
    { label: 'Recepción', count: 4, color: 'bg-blue-500' },
    { label: 'Diagnóstico', count: 2, color: 'bg-violet-500' },
    { label: 'Reparación', count: 3, color: 'bg-gray-500' },
    { label: 'Entregado', count: 8, color: 'bg-green-500' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [menuOpen, setMenuOpen] = useState(false);

    const ctaHref = auth.user ? route('dashboard') : route('register');
    const year = new Date().getFullYear();

    return (
        <>
            <Head title="TallerApp — Gestión para talleres">
                <meta
                    name="description"
                    content="TallerApp centraliza la gestión de clientes, vehículos, órdenes de trabajo, técnicos y servicios en una sola plataforma para talleres mecánicos, motocicletas y bicicletas."
                />
            </Head>

            <div className="bg-background text-foreground flex min-h-svh flex-col">
                <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
                    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <Link
                            href={route('home')}
                            className="focus-visible:ring-ring flex items-center gap-2 rounded-md font-semibold focus-visible:ring-2 focus-visible:outline-none"
                        >
                            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md">
                                <AppLogoIcon />
                            </span>
                            <span>TallerApp</span>
                        </Link>

                        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegación principal">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-2 md:flex">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={route('login')}>Iniciar sesión</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Comenzar</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú de navegación">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex w-3/4 flex-col sm:max-w-xs">
                                <SheetHeader className="border-b">
                                    <SheetTitle asChild>
                                        <Link href={route('home')} className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                                            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md">
                                                <AppLogoIcon />
                                            </span>
                                            TallerApp
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>

                                <nav className="flex flex-col gap-1 px-4" aria-label="Navegación móvil">
                                    {navLinks.map((link) => (
                                        <SheetClose asChild key={link.href}>
                                            <a
                                                href={link.href}
                                                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                                            >
                                                {link.label}
                                            </a>
                                        </SheetClose>
                                    ))}
                                </nav>

                                <div className="mt-auto flex flex-col gap-2 border-t p-4">
                                    {auth.user ? (
                                        <Button asChild>
                                            <Link href={route('dashboard')}>Dashboard</Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button asChild>
                                                <Link href={route('register')}>Comenzar</Link>
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <Link href={route('login')}>Iniciar sesión</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </header>

                <main className="flex-1">
                    {/* HERO */}
                    <section
                        id="inicio"
                        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24"
                    >
                        <div className="flex flex-col items-start gap-6">
                            <Badge variant="outline" className="text-muted-foreground">
                                Talleres mecánicos, motos y bicicletas
                            </Badge>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Gestiona tu taller de forma simple</h1>

                            <p className="text-muted-foreground text-lg leading-relaxed">
                                TallerApp centraliza la gestión de clientes, vehículos, órdenes de trabajo, técnicos y servicios en una sola
                                plataforma.
                            </p>

                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <Button size="lg" asChild>
                                    <Link href={ctaHref}>
                                        Comenzar ahora
                                        <ArrowRight />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <a href="#como-funciona">Ver cómo funciona</a>
                                </Button>
                            </div>
                        </div>

                        {/* Preview de la aplicación */}
                        <div className="mt-12 flex w-full flex-col gap-4 lg:mt-0">
                            <Card className="gap-4 py-5">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <LayoutDashboard className="text-muted-foreground h-4 w-4" />
                                        Panel central
                                    </CardTitle>
                                    <Badge variant="outline" className="border-green-200 bg-green-100 text-green-700">
                                        Reparado
                                    </Badge>
                                </CardHeader>

                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Wrench className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm font-medium">Servicios</span>
                                        </div>

                                        <div className="space-y-2">
                                            {serviceStatus.map((status) => (
                                                <div key={status.label} className="flex items-center justify-between">
                                                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                                                        <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
                                                        {status.label}
                                                    </span>
                                                    <span className="text-sm font-bold">{status.count}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="mt-3" />

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-muted-foreground text-sm">Total servicios</span>
                                            <span className="text-sm font-bold">17</span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Users className="h-4 w-4 text-violet-500" />
                                            <span className="text-sm font-medium">Clientes</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-sm">Total clientes</span>
                                                <span className="text-sm font-bold">128</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-sm">Nuevos este mes</span>
                                                <span className="text-sm font-bold">12</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground text-sm">Recurrentes</span>
                                                <span className="text-sm font-bold">45</span>
                                            </div>
                                        </div>

                                        <Separator className="mt-3" />

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-muted-foreground text-sm">Ingresos este mes</span>
                                            <span className="text-sm font-bold">$1.240.000</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-between gap-3 rounded-xl border p-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar className="h-9 w-9 shrink-0">
                                        <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">JP</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">Orden #4821</p>
                                        <p className="text-muted-foreground truncate text-sm">Juan Pérez — Moto Yamaha FZ</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="border-violet-200 bg-violet-100 text-violet-700">
                                    Diagnóstico
                                </Badge>
                            </div>
                        </div>
                    </section>

                    {/* CARACTERÍSTICAS */}
                    <section id="caracteristicas" className="bg-muted/40 scroll-mt-20 border-t py-16 lg:py-20">
                        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-10 max-w-2xl">
                                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Características</h2>
                                <p className="text-muted-foreground mt-2">Todo lo que tu taller necesita en un solo lugar.</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature) => (
                                    <article key={feature.title} className="bg-card rounded-xl border p-6">
                                        <div className="bg-secondary mb-4 flex h-10 w-10 items-center justify-center rounded-md">
                                            <feature.icon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <h3 className="font-medium">{feature.title}</h3>
                                        <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CÓMO FUNCIONA */}
                    <section id="como-funciona" className="scroll-mt-20 py-16 lg:py-20">
                        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-10 max-w-2xl">
                                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Cómo funciona</h2>
                                <p className="text-muted-foreground mt-2">Tres pasos para tener tu taller bajo control.</p>
                            </div>

                            <ol className="grid gap-4 md:grid-cols-3">
                                {steps.map((step, index) => (
                                    <li key={step.title} className="bg-card rounded-xl border p-6">
                                        <Badge variant="secondary" className="mb-4 flex size-8 items-center justify-center rounded-full p-0 text-sm">
                                            {index + 1}
                                        </Badge>
                                        <h3 className="font-medium">{step.title}</h3>
                                        <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    {/* CTA FINAL */}
                    <section className="bg-muted/40 border-t py-16 lg:py-20">
                        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                            <div className="bg-card rounded-xl border p-8 text-center shadow-sm sm:p-12">
                                <Rocket className="text-muted-foreground mx-auto mb-4 h-6 w-6" aria-hidden="true" />
                                <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Empieza a gestionar tu taller de una forma más simple.
                                </h2>
                                <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm">
                                    Centraliza clientes, vehículos, órdenes de trabajo y servicios con TallerApp.
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <Button size="lg" asChild>
                                        <Link href={ctaHref}>
                                            Comenzar ahora
                                            <ArrowRight />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
                                <AppLogoIcon />
                            </span>
                            <span className="text-sm font-semibold">TallerApp</span>
                        </div>

                        <nav className="flex items-center gap-4" aria-label="Enlaces del pie de página">
                            <a
                                href="#inicio"
                                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            >
                                Inicio
                            </a>
                            <Link
                                href={route('login')}
                                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            >
                                Registrarse
                            </Link>
                        </nav>

                        <p className="text-muted-foreground text-sm">© {year} TallerApp. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
