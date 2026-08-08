import { Head } from '@inertiajs/react';
import { FileDown, CheckCircle2, XCircle } from 'lucide-react';
import type { CostApprovalProps } from '@/types';

const appUrl = import.meta.env.VITE_APP_URL;

const formatCost = (cost: number | null) => {
    if (cost === null || cost === undefined) {
        return null;
    }

    return `$${new Intl.NumberFormat('es-CL').format(cost)}`;
};

function InfoRow({ label, value }: { label: string; value: string | null }) {
    if (!value) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-4 py-1.5">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-right text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-5 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h2 className="mb-3 border-b border-gray-100 pb-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function CostApproval({ servi, issues, spare_parts, total, pdf_url, approve_url, reject_url }: CostApprovalProps) {
    return (
        <>
            <Head title="Aprobación de costos" />

            <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4 dark:bg-gray-900 sm:p-8">
                <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8">
                    <header className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {servi.organization_name ?? 'Taller'}
                        </h1>
                        {servi.organization_description && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {servi.organization_description}
                            </p>
                        )}
                    </header>

                    <Section title="Datos del servicio">
                        <InfoRow label="Cliente" value={servi.client_name} />
                        <InfoRow label="Producto" value={servi.product_name} />
                        <InfoRow label="Marca" value={servi.product_brand} />
                        <InfoRow label="Modelo" value={servi.product_model} />
                        <InfoRow label="Fecha de ingreso" value={servi.date_entry} />
                    </Section>

                    <Section title="Diagnóstico y costos">
                        {issues.filter((issue) => issue.attend).map((issue) => (
                            <div key={issue.id} className="mb-4 rounded-md border border-gray-100 p-3 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.issue}</p>
                                {issue.diagnosis && (
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{issue.diagnosis}</p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                                    {issue.repair_time && (
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Tiempo estimado: {issue.repair_time}
                                        </span>
                                    )}
                                    {formatCost(issue.cost) && (
                                        <span className="font-semibold text-teal-700 dark:text-teal-400">
                                            {formatCost(issue.cost)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Section>

                    {spare_parts.length > 0 && (
                        <Section title="Repuestos">
                            <div className="flex flex-col gap-2">
                                {spare_parts.map((part) => (
                                    <div key={part.id} className="flex items-center justify-between rounded-md border border-gray-100 p-3 text-sm dark:border-gray-700">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {part.brand} {part.model}
                                            </div>
                                            {part.note && <div className="text-gray-500 dark:text-gray-400">{part.note}</div>}
                                        </div>
                                        <span className="font-semibold text-teal-700 dark:text-teal-400">
                                            {formatCost(part.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    <Section title="Total">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total del servicio</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatCost(total)}</span>
                        </div>
                    </Section>

                    {servi.files.length > 0 && (
                        <Section title="Imágenes del servicio">
                            <div className="flex flex-wrap gap-2">
                                {servi.files.map((path, index) => (
                                    <img
                                        key={`${path}-${index}`}
                                        src={`${appUrl}/storage/${path}`}
                                        alt={`Imagen del servicio ${index + 1}`}
                                        className="h-28 w-40 rounded-md border border-gray-200 object-cover dark:border-gray-700"
                                    />
                                ))}
                            </div>
                        </Section>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <a
                            href={pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <FileDown className="h-4 w-4" />
                            Descargar PDF
                        </a>
                        <div className="flex gap-3">
                            <a
                                href={reject_url}
                                className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950"
                            >
                                <XCircle className="h-4 w-4" />
                                Rechazar
                            </a>
                            <a
                                href={approve_url}
                                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Aprobar
                            </a>
                        </div>
                    </div>

                    <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                        Documento generado el {new Date().toLocaleDateString('es-CL')}
                    </footer>
                </div>
            </div>
        </>
    );
}
