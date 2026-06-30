import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportes',
        href: '/reports'
    }
]

export default function Documents(){

    return(
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">     
                    
                    <div className="flex h-full flex-1 flex-col items-center gap-4 rounded-xl">
                        
                        Reporte avance servicio
                        Reporte servicio terminado
                        
                    </div>
                </div>    
        </AppLayout>
    )
}