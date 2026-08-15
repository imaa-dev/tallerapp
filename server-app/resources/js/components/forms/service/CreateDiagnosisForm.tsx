import { createDiagnosis, toAproveSpareParts } from '@/api/services/diagnosisService';
import { getServiceIssues } from '@/api/services/issuesService';
import ServiceImages from '@/components/forms/service/ServiceImages';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/LoadingContext';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { selectStyle } from '@/styles/reactSelect';
import { DiagnosisData, ServiceIssue, ServiData } from '@/types';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle2, ClipboardCheck, Pencil, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import Select from 'react-select';

export interface IssueOption {
    value: string;
    label: string;
    color: string;
}

export function CreateDiagnosisForm({ service }: { service: ServiData }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [issues, setIssues] = useState<ServiceIssue[]>(service.service_issues ?? []);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [selectedIssue, setSelectedIssue] = useState<IssueOption | null>(null);
    const [editingIssue, setEditingIssue] = useState<ServiceIssue | null>(null);
    const { data, setData, errors, processing } = useForm<Omit<DiagnosisData, 'id'>>({
        servi_id: service.id,
        diagnosis: '',
        repair_time: '',
        cost: undefined,
    });

    useEffect(() => {
        let active = true;

        const loadIssues = async () => {
            try {
                const response = await getServiceIssues(service.id);
                if (active && response.data) {
                    setIssues(response.data);
                }
            } catch {
                // fall back a las issues enviadas por props
            }
        };

        loadIssues();

        return () => {
            active = false;
        };
    }, [service.id]);

    const attendedIssues = issues.filter((i) => i.attend);
    const pendingIssues = issues.filter((i) => !i.attend);
    const formatedIssues: IssueOption[] = [
        ...pendingIssues.map((i) => ({
            value: String(i.id),
            label: i.issue,
            color: '#0052CC',
        })),
        ...(editingIssue ? [{ value: String(editingIssue.id), label: editingIssue.issue, color: '#0052CC' }] : []),
    ];

    const truncateText = (text: string, max = 80) => (text.length > max ? `${text.slice(0, max)}...` : text);

    const startEdit = (issue: ServiceIssue) => {
        setEditingIssue(issue);
        setSelectedIssue({ value: String(issue.id), label: issue.issue, color: '#0052CC' });
        setData({
            servi_id: service.id,
            diagnosis: issue.diagnosis ?? '',
            repair_time: issue.repair_time ?? '',
            cost: issue.cost ?? undefined,
        });
    };

    const addDiagnosis = async () => {
        if (submitting) {
            return;
        }
        if (!selectedIssue) {
            error('Debes seleccionar un detalle de ingreso.');
            return;
        }
        setSubmitting(true);
        showLoading();
        try {
            const response = await createDiagnosis(data, [selectedIssue]);

            success(response.message);

            const selectedId = Number(selectedIssue.value);
            setIssues((prev) =>
                prev.map((issue) => {
                    if (issue.id !== selectedId) {
                        return issue;
                    }

                    return {
                        ...issue,
                        attend: true,
                        diagnosis: data.diagnosis,
                        repair_time: data.repair_time,
                        cost: data.cost ?? null,
                    };
                }),
            );
            setSelectedIssue(null);
            setEditingIssue(null);
            setData({
                servi_id: service.id,
                diagnosis: '',
                repair_time: '',
                cost: undefined,
            });
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const { status, data: responseData } = err.response;
            switch (status) {
                case 409:
                    error(responseData?.message ?? 'No se pudo eliminar el registro.');
                    break;
                case 422:
                    error(responseData?.message ?? 'Los datos enviados son inválidos.');
                    break;
                case 401:
                    error('Tu sesión ha expirado.');
                    break;
                case 403:
                    error('No tienes permisos para realizar esta acción.');
                    break;
                case 404:
                    error('La organización no existe.');
                    break;
                case 500:
                    error('Ha ocurrido un error interno del servidor.');
                    break;
                default:
                    error(responseData?.message ?? 'Ha ocurrido un error inesperado.');
            }
        } finally {
            setSubmitting(false);
            hideLoading();
        }
    };

    const aproveSparePart = async () => {
        showLoading();
        try {
            const response = await toAproveSpareParts(service.id);
            success(response.message);
            closeModal();
            router.visit('/service');
        } catch (err: unknown) {
            if (!axios.isAxiosError(err) || !err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            const { status, data: responseData } = err.response;
            switch (status) {
                case 409:
                    error(responseData?.message ?? 'No se pudo eliminar el registro.');
                    break;
                case 422:
                    error(responseData?.message ?? 'Los datos enviados son inválidos.');
                    break;
                case 401:
                    error('Tu sesión ha expirado.');
                    break;
                case 403:
                    error('No tienes permisos para realizar esta acción.');
                    break;
                case 404:
                    error('La organización no existe.');
                    break;
                case 500:
                    error('Ha ocurrido un error interno del servidor.');
                    break;
                default:
                    error(responseData?.message ?? 'Ha ocurrido un error inesperado.');
            }
        } finally {
            hideLoading();
        }
    };

    return (
        <form className="flex max-h-[70vh] w-full flex-col gap-4 overflow-y-auto p-1">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5" />
                        Diagnóstico del servicio a reparar
                    </CardTitle>
                    <CardDescription>Seleccioná un detalle de ingreso y registrá el diagnóstico, tiempo y costo estimado.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div>
                        <Label htmlFor="issue-select">Detalle de ingreso</Label>
                        <Select
                            closeMenuOnSelect
                            isClearable
                            tabIndex={1}
                            name="issue-select"
                            options={formatedIssues}
                            value={selectedIssue}
                            placeholder="Selecciona un detalle de ingreso"
                            classNamePrefix="issue-select"
                            styles={selectStyle}
                            isDisabled={submitting}
                            onChange={(value) => {
                                const option = value as unknown as IssueOption | null;
                                setSelectedIssue(option);
                                if (editingIssue && option && Number(option.value) !== editingIssue.id) {
                                    setEditingIssue(null);
                                }
                            }}
                        />
                    </div>

                    {attendedIssues.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium">Motivos de ingreso atendidos</p>
                            {attendedIssues.map((issue) => {
                                const isEditing = editingIssue?.id === issue.id;
                                return (
                                    <div
                                        key={issue.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => startEdit(issue)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                startEdit(issue);
                                            }
                                        }}
                                        title="Editar este detalle"
                                        className={`flex cursor-pointer items-start gap-2 rounded-md border p-3 transition ${
                                            isEditing
                                                ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950'
                                                : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                                        }`}
                                    >
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{issue.issue}</div>
                                            {issue.diagnosis && (
                                                <div className="text-sm text-gray-600 dark:text-gray-300">{truncateText(issue.diagnosis)}</div>
                                            )}
                                            {isEditing && (
                                                <div className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                                    Editando este detalle...
                                                </div>
                                            )}
                                        </div>
                                        <Pencil className="h-4 w-4 shrink-0 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400" />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="diagnosis">
                            Diagnóstico <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            id="diagnosis"
                            name="diagnosis"
                            required
                            tabIndex={2}
                            autoComplete="diagnosis"
                            value={data.diagnosis}
                            onChange={(e) => setData('diagnosis', e.target.value)}
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 mt-2 flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-colors focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        <InputError message={errors.diagnosis} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="repairTime">
                            Tiempo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="repairTime"
                            id="repairTime"
                            required
                            tabIndex={3}
                            autoComplete="repairTime"
                            className="mt-2"
                            value={data.repair_time}
                            onChange={(e) => setData('repair_time', e.target.value)}
                        />
                        <InputError message={errors.repair_time} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="cost">
                            Costo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            name="cost"
                            id="cost"
                            required
                            tabIndex={4}
                            autoComplete="cost"
                            className="mt-2"
                            value={data.cost ?? ''}
                            onChange={(e) => setData('cost', Number(e.target.value))}
                        />
                        <InputError message={errors.cost} className="mt-2" />
                    </div>

                    <ServiceImages initialFiles={service.file} serviceId={service.id} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="flex items-center justify-between gap-4 p-6">
                    <div>
                        <p className="font-medium">{editingIssue ? 'Actualizar diagnóstico' : 'Agregar diagnóstico'}</p>
                        <p className="text-muted-foreground text-sm">
                            {editingIssue ? 'Guardá los cambios del detalle seleccionado.' : 'El detalle quedará marcado como atendido.'}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button type="button" variant="outline" tabIndex={7} disabled={processing || submitting} onClick={() => addDiagnosis()}>
                            <Save className="mr-2 h-4 w-4" />
                            {editingIssue ? 'Actualizar Diagnóstico' : 'Agregar Diagnóstico'}
                        </Button>
                        <Button type="button" tabIndex={8} disabled={processing || submitting} onClick={() => aproveSparePart()}>
                            Finalizar y pasar a repuestos
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
