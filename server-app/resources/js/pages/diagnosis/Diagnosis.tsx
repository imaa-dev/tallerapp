import { Head } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import type { PublicDiagnosisProps } from '@/types';

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

export default function Diagnosis({ issue, servi, pdf_url }: PublicDiagnosisProps) {
    return (
        <>
            <Head title="Diagnóstico del servicio" />

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

                    <Section title="Motivo de ingreso">
                        <p className="text-sm text-gray-900 dark:text-gray-100">{issue.issue}</p>
                    </Section>

                    <Section title="Diagnóstico">
                        <p className="mb-3 text-sm text-gray-900 dark:text-gray-100">{issue.diagnosis}</p>
                        <InfoRow label="Tiempo estimado de reparación" value={issue.repair_time} />
                        {formatCost(issue.cost) && (
                            <div className="flex items-center justify-between gap-4 py-1.5">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Costo del diagnóstico</span>
                                <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                                    {formatCost(issue.cost)}
                                </span>
                            </div>
                        )}
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

                    <div className="mt-6 text-center">
                        <a
                            href={pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            <FileDown className="h-4 w-4" />
                            Descargar diagnóstico en PDF
                        </a>
                    </div>

                    <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                        Documento generado el {new Date().toLocaleDateString('es-CL')}
                    </footer>
                </div>
            </div>
        </>
    );
}
