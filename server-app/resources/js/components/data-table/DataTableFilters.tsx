import { Button } from '@/components/ui/button';
import React from 'react';

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterField {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'select';
    placeholder?: string;
    options?: FilterOption[];
}

interface DataTableFiltersProps {
    fields: FilterField[];
    values: Record<string, unknown>;
    onChange: (field: string, value: string) => void;
    onSearch: () => void;
    onClear: () => void;
    actions?: React.ReactNode;
}

export default function DataTableFilters({ fields, values, onChange, onSearch, onClear, actions }: DataTableFiltersProps) {
    const renderField = (field: FilterField) => {
        const value = String(values[field.key] ?? '');

        const commonLabel = (
            <label htmlFor={field.key} className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {field.label}
            </label>
        );

        switch (field.type) {
            case 'date':
                return (
                    <div key={field.key}>
                        {commonLabel}

                        <input
                            id={field.key}
                            type="date"
                            value={value}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm focus:border-blue-600 focus:ring-0 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.key}>
                        {commonLabel}

                        <select
                            id={field.key}
                            value={value}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                        >
                            <option value="">Todos</option>

                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            default:
                return (
                    <div key={field.key}>
                        {commonLabel}

                        <input
                            id={field.key}
                            type="text"
                            placeholder={field.placeholder ?? field.label}
                            value={value}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:border-blue-600 focus:ring-0 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                );
        }
    };

    return (
        <div className="mb-5 rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold">Filtros</h2>

                <div className="flex flex-wrap items-center gap-2">{actions}</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{fields.map(renderField)}</div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClear}>
                    Limpiar
                </Button>

                <Button type="button" size="sm" onClick={onSearch}>
                    Buscar
                </Button>
            </div>
        </div>
    );
}
