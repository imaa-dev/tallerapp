import React, { useEffect, useState } from 'react';
import { CheckCircle2, Pencil } from 'lucide-react';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import InputError from '@/components/input-error';
import ServiceImages from '@/components/forms/service/ServiceImages';
import { DiagnosisData, ServiceIssue, ServiData } from '@/types';
import { createDiagnosis, toAproveSpareParts } from '@/api/services/diagnosisService';
import { getServiceIssues } from '@/api/services/issuesService';
import Select from 'react-select';
import { selectStyle } from '@/styles/reactSelect';

export interface IssueOption {
    value: string;
    label: string;
    color: string;
}

export function CreateDiagnosisForm({ service }: { service: ServiData }  ) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [ issues, setIssues ] = useState<ServiceIssue[]>(service.service_issues ?? []);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ notificateClient, setNotificateClient ] = useState<boolean>(false);
    const [ notificateTechnician, setNotificateTechnician ] = useState<boolean>(false);
    const [ selectedIssue, setSelectedIssue ] = useState<IssueOption | null>(null);
    const [ editingIssue, setEditingIssue ] = useState<ServiceIssue | null>(null);
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
                // fall back to las issues enviadas por props
            }
        };

        loadIssues();

        return () => {
            active = false;
        };
    }, [service.id]);

    const attendedIssues = issues.filter(i => i.attend);
    const pendingIssues = issues.filter(i => !i.attend);
    const formatedIssues: IssueOption[] = [
        ...pendingIssues.map(i => ({
            value: String(i.id),
            label: i.issue,
            color: '#0052CC'
        })),
        ...(editingIssue
            ? [{ value: String(editingIssue.id), label: editingIssue.issue, color: '#0052CC' }]
            : []),
    ];

    const truncateText = (text: string, max = 80) =>
        text.length > max ? `${text.slice(0, max)}...` : text;

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
            const response = await createDiagnosis(
                data,
                [selectedIssue],
                notificateClient,
                notificateTechnician
            );

            success(response.message);

            const selectedId = Number(selectedIssue.value);
            setIssues(prev => prev.map(issue => {
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
            }));
            setSelectedIssue(null);
            setEditingIssue(null);
            setData({
                servi_id: service.id,
                diagnosis: '',
                repair_time: '',
                cost: undefined,
            });

        } catch (err: any) {
            if (!err.response) {
                // Backend apagado, timeout, sin internet, CORS, etc.
                error("No fue posible conectar con el servidor.");
                return;
            }
            const status = err.response.status;
            switch (status) {
                case 409:
                    error(err.response.data.message ?? "No se pudo eliminar el registro.");
                    break;

                case 422:
                    error(err.response.data.message ?? "Los datos enviados son inválidos.");
                    break;

                case 401:
                    error("Tu sesión ha expirado.");
                    break;

                case 403:
                    error("No tienes permisos para realizar esta acción.");
                    break;

                case 404:
                    error("La organización no existe.");
                    break;

                case 500:
                    error("Ha ocurrido un error interno del servidor.");
                    break;

                default:
                    error(
                        err.response.data?.message ??
                        "Ha ocurrido un error inesperado."
                    );
            }        
        } finally {
            setSubmitting(false);
            hideLoading();
        }

    }
    const aproveSparePart = async () => {
        showLoading();
        try {
            const response = await toAproveSpareParts(service.id, notificateClient, notificateTechnician);
            success(response.message);
            router.visit('/service');
            closeModal();
        } catch (err: any) {
            if (!err.response) {
                // Backend apagado, timeout, sin internet, CORS, etc.
                error("No fue posible conectar con el servidor.");
                return;
            }
            const status = err.response.status;
            switch (status) {
                case 409:
                    error(err.response.data.message ?? "No se pudo eliminar el registro.");
                    break;

                case 422:
                    error(err.response.data.message ?? "Los datos enviados son inválidos.");
                    break;

                case 401:
                    error("Tu sesión ha expirado.");
                    break;

                case 403:
                    error("No tienes permisos para realizar esta acción.");
                    break;

                case 404:
                    error("La organización no existe.");
                    break;

                case 500:
                    error("Ha ocurrido un error interno del servidor.");
                    break;

                default:
                    error(
                        err.response.data?.message ??
                        "Ha ocurrido un error inesperado."
                    );
            }     
        } finally{
            hideLoading()
        }
    }

    return (
        <React.Fragment>
            <form className="max-h-[70vh] w-full flex-col justify-center gap-6 overflow-y-auto rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <SidebarGroupLabel> Diagnostico del servicio a reparar </SidebarGroupLabel>

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

                {attendedIssues.length > 0 && (
                    <div className="mt-4">
                        <SidebarGroupLabel> Motivos de ingreso atendidos </SidebarGroupLabel>
                        {attendedIssues.map(issue => {
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
                                    className={`mt-2 flex cursor-pointer items-start gap-2 rounded-md border p-3 transition ${
                                        isEditing
                                            ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950'
                                            : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                                    }`}
                                >
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {issue.issue}
                                        </div>
                                        {issue.diagnosis && (
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                {truncateText(issue.diagnosis)}
                                            </div>
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

                <div className="group relative z-0 mt-4 mb-5 w-full">
                    <textarea
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        name="diagnosis"
                        id="diagnosis"
                        required
                        tabIndex={2}
                        autoComplete="diagnosis"
                        value={data.diagnosis}
                        onChange={(e) => setData('diagnosis', e.target.value)}
                    />
                    <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500">
                        Diagnostico <span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.diagnosis} />
                </div>
                <div className="group relative z-0 mb-5 w-full">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="repairTime"
                        id="repairTime"
                        required
                        tabIndex={3}
                        autoComplete="repairTime"
                        value={data.repair_time}
                        onChange={(e) => setData('repair_time', e.target.value)}
                    />
                    <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500">
                        Tiempo<span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.repair_time} />
                </div>
                <div className="group relative z-0 mb-5 w-full">
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="number"
                        name="cost"
                        id="cost"
                        required
                        tabIndex={4}
                        autoComplete="cost"
                        value={data.cost ?? ''}
                        onChange={(e) => setData('cost', Number(e.target.value))}
                    />
                    <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500">
                        Costo <span className="text-red-500">*</span>
                    </label>
                    <InputError message={errors.cost} />
                </div>
                <div className="group relative z-0 mb-5 flex w-full items-center">
                    <input
                        type="checkbox"
                        name="isNotificable"
                        id="isNotificable"
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        checked={notificateClient}
                        onChange={(e) => setNotificateClient(e.target.checked)}
                        tabIndex={5}
                    />

                    <label htmlFor="isNotificable" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        Enviar avances al correo de cliente
                    </label>
                </div>
                <div className="group relative z-0 mb-5 flex w-full items-center">
                    <input
                        type="checkbox"
                        name="isNotificable"
                        id="isNotificableMe"
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        checked={notificateTechnician}
                        onChange={(e) => setNotificateTechnician(e.target.checked)}
                        tabIndex={5}
                    />

                    <label htmlFor="isNotificableMe" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        Enviar avances a mi correo
                    </label>
                </div>
                <ServiceImages initialFiles={service.file} serviceId={service.id} />
                <Button type="button" className="mt-4 w-full" tabIndex={7} disabled={processing || submitting} onClick={() => addDiagnosis()}>
                    {editingIssue ? 'Actualizar Diagnostico' : 'Agregar Diagnostico'}
                </Button>
                <Button type="button" className="mt-4 w-full" tabIndex={8} disabled={processing || submitting} onClick={() => aproveSparePart()}>
                    Finalizar y pasar a revision
                </Button>
            </form>
        </React.Fragment>
    );
}
