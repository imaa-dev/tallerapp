import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import {
    FileText,
    Download,
    Eye,
    FileQuestion,
    Calendar,
} from "lucide-react";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documentos',
        href: '/reports'
    }
]

interface RepairDocument {
    service_id: number;
    organization_id: number,
    type: string;
    filename: string;
    path: string;
    created_at: string;
}

interface DocumentsProps {
    documents: RepairDocument[];
}


export default function Documents({ documents }: DocumentsProps) {
    const groupedDocuments = documents.reduce((acc, doc) => {
        if (!acc[doc.service_id]) {
            acc[doc.service_id] = {};
        }

        acc[doc.service_id][doc.type.toLowerCase()] = doc;

        return acc;
    }, {} as Record<number, Record<string, RepairDocument>>);

    const renderDocument = (
        doc: RepairDocument | undefined,
        title: string
    ) => {

        if (!doc) {
            return (
                <div className="rounded-xl border border-dashed bg-gray-50 p-6 dark:bg-gray-900">
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <FileQuestion className="mb-4 h-14 w-14 text-gray-400" />

                        <h3 className="font-semibold">
                            {title}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Documento no disponible
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">

                <div className="mb-5 flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-lg">
                            {title}
                        </h2>

                        <p className="text-sm text-gray-500">
                            Servicio #{doc.service_id}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 text-sm">

                    <div>
                        <p className="font-medium text-gray-500">
                            Archivo
                        </p>

                        <p className="truncate">
                            {doc.filename}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(doc.created_at).toLocaleString()}
                    </div>

                </div>

                <div className="mt-6 flex gap-3">

                    <a
                        href={`/storage/${doc.path}`}
                        target="_blank"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                        <Eye className="h-4 w-4" />
                        Ver
                    </a>

                    <a
                        href={`/storage/${doc.path}`}
                        download
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Download className="h-4 w-4" />
                        Descargar
                    </a>

                </div>

            </div>
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <h1 className="mb-6 text-2xl font-semibold">
                            Documentos del servicio
                        </h1>

                        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">

                            {Object.entries(groupedDocuments).map(([serviceId, docs]) => (
                                <div
                                    key={serviceId}
                                    className="col-span-full rounded-xl border p-6"
                                >
                                    <h2 className="mb-6 text-xl font-semibold">
                                        Servicio #{serviceId}
                                    </h2>

                                    <div className="grid gap-6 md:grid-cols-2">

                                        {renderDocument(
                                            docs["diagnosis"],
                                            "Diagnóstico"
                                        )}

                                        {renderDocument(
                                            docs["final"],
                                            "Reporte Final"
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}