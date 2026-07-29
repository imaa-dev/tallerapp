import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ListSparePartsData } from '@/types';
import { Trash2, Edit2, X, Plus } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';
import { getSpareParts } from '@/api/services/sparepartsService';
import InputError from '@/components/input-error';

interface ServiceSparePartsSectionProps {
    spareparts: ListSparePartsData[];
    serviceId: number;
}

export default function ServiceSparePartsSection({
    spareparts: initialSpareParts,
    serviceId,
}: ServiceSparePartsSectionProps) {
    const [spareparts, setSpareparts] = useState(initialSpareParts);
    const [availableSpareParts, setAvailableSpareParts] = useState<ListSparePartsData[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedSparePartId, setSelectedSparePartId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const { success, error } = useToast();
    const { showLoading, hideLoading } = useLoading();

    // Load available spare parts from database
    useEffect(() => {
        const loadAvailableSpareParts = async () => {
            try {
                const response = await getSpareParts();
                if (response && Array.isArray(response)) {
                    setAvailableSpareParts(response);
                }
            } catch (err: any) {
                console.error('Error loading spare parts:', err);
            }
        };

        loadAvailableSpareParts();
    }, []);

    if ((!spareparts || spareparts.length === 0) && !isAdding) {
        return (
            <Card className="m-5 mt-10 max-w-4xl p-6">
                <div className="flex items-center justify-between">
                    <SidebarGroupLabel>Repuestos del Servicio</SidebarGroupLabel>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsAdding(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Agregar Repuesto
                    </Button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    No hay repuestos agregados. Haz clic en "Agregar Repuesto" para añadir uno.
                </p>

                {isAdding && (
                    <div className="mt-6 space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                        <div className="group relative z-0 mb-5">
                            <label
                                htmlFor="spare_part_select"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Seleccionar Repuesto
                            </label>
                            <select
                                id="spare_part_select"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={selectedSparePartId || ''}
                                onChange={(e) =>
                                    setSelectedSparePartId(
                                        e.target.value ? Number(e.target.value) : null
                                    )
                                }
                            >
                                <option value="">Elige un repuesto</option>
                                {availableSpareParts.map((spare) => (
                                    <option key={spare.id} value={spare.id}>
                                        {spare.brand} - {spare.model} (${spare.price.toFixed(2)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="flex-1"
                                onClick={() => {
                                    if (!selectedSparePartId) {
                                        error('Por favor selecciona un repuesto');
                                        return;
                                    }
                                    const selectedSpare = availableSpareParts.find(
                                        (sp) => sp.id === selectedSparePartId
                                    );
                                    if (selectedSpare) {
                                        setSpareparts([...spareparts, selectedSpare]);
                                        success('Repuesto agregado correctamente');
                                        setSelectedSparePartId(null);
                                        setIsAdding(false);
                                    }
                                }}
                            >
                                Agregar
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setIsAdding(false);
                                    setSelectedSparePartId(null);
                                }}
                            >
                                <X className="mr-2 h-4 w-4" /> Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        );
    }

    const handleEdit = (spare: ListSparePartsData) => {
        setEditingId(spare.id);
    };

    const handleCancel = () => {
        setEditingId(null);
        setSelectedSparePartId(null);
    };

    const handleSaveEdit = async (spare: ListSparePartsData) => {
        if (!selectedSparePartId) {
            error('Por favor selecciona un repuesto');
            return;
        }

        const selectedSpare = availableSpareParts.find(
            (sp) => sp.id === selectedSparePartId
        );

        if (!selectedSpare) {
            error('Repuesto no encontrado');
            return;
        }

        try {
            showLoading();
            // TODO: Implement API call to update spare part in service
            // const response = await updateServiceSparePart(serviceId, spare.id, selectedSparePartId);
            // if (response.success) {

            setSpareparts(
                spareparts.map((sp) =>
                    sp.id === spare.id ? selectedSpare : sp
                )
            );
            success('Repuesto actualizado correctamente');
            setEditingId(null);
            setSelectedSparePartId(null);
            // }
        } catch (err: any) {
            error(err.message || 'Error al actualizar repuesto');
        } finally {
            hideLoading();
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este repuesto?')) {
            try {
                showLoading();
                // TODO: Implement API call to delete spare part from service
                // const response = await deleteServiceSparePart(serviceId, id);
                // if (response.success) {

                setSpareparts(spareparts.filter((sp) => sp.id !== id));
                success('Repuesto eliminado correctamente');
                // }
            } catch (err: any) {
                error(err.message || 'Error al eliminar repuesto');
            } finally {
                hideLoading();
            }
        }
    };

    const handleAddMore = () => {
        setIsAdding(true);
        setSelectedSparePartId(null);
    };

    return (
        <Card className="m-5 mt-10 max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <SidebarGroupLabel>Repuestos del Servicio</SidebarGroupLabel>
                <Button
                    type="button"
                    size="sm"
                    onClick={handleAddMore}
                    disabled={isAdding}
                >
                    <Plus className="mr-2 h-4 w-4" /> Agregar Repuesto
                </Button>
            </div>

            <div className="space-y-4">
                {spareparts.map((spare) => (
                    <div
                        key={spare.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                    >
                        {editingId === spare.id ? (
                            <div className="space-y-4">
                                <div className="group relative z-0 mb-5">
                                    <label
                                        htmlFor={`edit_spare_part_${spare.id}`}
                                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Seleccionar Repuesto
                                    </label>
                                    <select
                                        id={`edit_spare_part_${spare.id}`}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        value={selectedSparePartId || spare.id}
                                        onChange={(e) =>
                                            setSelectedSparePartId(Number(e.target.value))
                                        }
                                    >
                                        <option value={spare.id}>
                                            {spare.brand} - {spare.model} (${spare.price.toFixed(2)})
                                        </option>
                                        {availableSpareParts.map((sp) => (
                                            <option key={sp.id} value={sp.id}>
                                                {sp.brand} - {sp.model} (${sp.price.toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        className="flex-1"
                                        onClick={() => handleSaveEdit(spare)}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleCancel}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {spare.brand} - {spare.model}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {spare.note}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400">
                                                ${spare.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(spare)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(spare.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isAdding && (
                    <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                            Agregar nuevo repuesto
                        </h4>
                        <div className="group relative z-0 mb-5">
                            <label
                                htmlFor="add_spare_part_select"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Seleccionar Repuesto
                            </label>
                            <select
                                id="add_spare_part_select"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={selectedSparePartId || ''}
                                onChange={(e) =>
                                    setSelectedSparePartId(
                                        e.target.value ? Number(e.target.value) : null
                                    )
                                }
                            >
                                <option value="">Elige un repuesto</option>
                                {availableSpareParts
                                    .filter(
                                        (sp) =>
                                            !spareparts.find((existing) => existing.id === sp.id)
                                    )
                                    .map((spare) => (
                                        <option key={spare.id} value={spare.id}>
                                            {spare.brand} - {spare.model} (${spare.price.toFixed(2)})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="flex-1"
                                onClick={() => {
                                    if (!selectedSparePartId) {
                                        error('Por favor selecciona un repuesto');
                                        return;
                                    }
                                    const selectedSpare = availableSpareParts.find(
                                        (sp) => sp.id === selectedSparePartId
                                    );
                                    if (selectedSpare) {
                                        setSpareparts([...spareparts, selectedSpare]);
                                        success('Repuesto agregado correctamente');
                                        setSelectedSparePartId(null);
                                        setIsAdding(false);
                                    }
                                }}
                            >
                                Agregar
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setIsAdding(false);
                                    setSelectedSparePartId(null);
                                }}
                            >
                                <X className="mr-2 h-4 w-4" /> Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
