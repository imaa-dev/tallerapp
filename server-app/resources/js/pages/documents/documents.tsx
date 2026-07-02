import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, DocumentFilters, Pagination, RepairDocument } from "@/types";
import {
    FileText,
    Download,
    Eye,
    FileQuestion,
    Calendar,
} from "lucide-react";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { getDocuments } from "@/api/repairDocument/repairDocumentService";
import DataFilterPagination from "@/components/data-table/DataFilterPagination";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documentos',
        href: '/reports'
    }
]

interface DocumentsProps {
    documents: RepairDocument[];
    pagination: Pagination
}


export default function Documents({ documents, pagination: initialPagination }: DocumentsProps) {
    const [documentList, setDocumentList] = useState(documents);
    const [pagination, setPagination] = useState(initialPagination);
    const groupedDocuments = new Map<number, Record<string, RepairDocument>>();
    const [filters, setFilters] = useState({
        search: "",
        from: "",
        to: "",
    });

    const handleFilterChange = (
        field: keyof typeof filters,
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const clearFilters = async () => {

        const reset = {
            search: "",
            from: "",
            to: "",
        };
        setFilters(reset);
        await getDocuments(reset);

    };

    const searchDocuments = async (page = 1) => {

        const response = await getDocuments({
            ...filters,
            page
        });

        if (response.success) {

            setDocumentList(response.documents);
            setPagination(response.pagination);

        }
    }
    documentList.forEach((doc) => {
        if (!groupedDocuments.has(doc.service_id)) {
            groupedDocuments.set(doc.service_id, {});
        }
        groupedDocuments.get(doc.service_id)![doc.type.toLowerCase()] = doc;
    });
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

                        <div className="mb-6 rounded-xl border bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Filtros
                                </h2>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">


                                {/* Buscar */}
                                <div className="group relative z-0 w-full">
                                    <input
                                        type="text"
                                        id="search"
                                        placeholder=" "
                                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                    />

                                    <label
                                        htmlFor="search"
                                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
                                    >
                                        Buscar archivo
                                    </label>
                                </div>

                                {/* Desde */}
                                <div className="group relative z-0 w-full">
                                    <input
                                        type="date"
                                        id="from"
                                        className="block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                        value={filters.from}
                                        onChange={(e) => handleFilterChange("from", e.target.value)}
                                    />

                                    <label
                                        htmlFor="from"
                                        className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Desde
                                    </label>
                                </div>

                                {/* Hasta */}
                                <div className="group relative z-0 w-full">
                                    <input
                                        type="date"
                                        id="to"
                                        className="block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                        value={filters.to}
                                        onChange={(e) => handleFilterChange("to", e.target.value)}
                                    />

                                    <label
                                        htmlFor="to"
                                        className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400"
                                    >
                                        Hasta
                                    </label>
                                </div>

                            </div>

                            <div className="mt-8 flex flex-wrap items-center justify-end gap-4">

                                <button
                                    type="button"
                                    onClick={searchDocuments}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Buscar
                                </button>
                                <button
                                    type="button"
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                                    onClick={clearFilters}
                                >
                                    Limpiar filtros
                                </button>

                            </div>

                        </div>
                        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">

                            {Array.from(groupedDocuments.entries()).map(([serviceId, docs]) => (
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
                        <DataFilterPagination
                            pagination={pagination}
                            onPageChange={searchDocuments}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}