import React, { useState } from 'react';
import { useModal } from '@/context/ModalContextForm';
import { useToast } from '@/context/ToastContext';
import { useLoading } from '@/context/LoadingContext';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import InputError from '@/components/input-error';
import ServiceImages from '@/components/forms/service/ServiceImages';
import { DiagnosisData, ServiData } from '@/types';
import { createDiagnosis, toAproveSpareParts } from '@/api/services/diagnosisService';
import Select from 'react-select';
import { selectStyle } from '@/styles/reactSelect';

export function CreateDiagnosisForm({ service }: { service: ServiData }  ) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [ reasons ] = useState(service.reasons);
    const [ notificateClient, setNotificateClient ] = useState<boolean>(false);
    const [ notificateTechnician, setNotificateTechnician ] = useState<boolean>(false);
    const [ selectedReasons, setSelectedReasons ] = useState([]);
    const { data, setData, errors, processing, setError } = useForm<Required<DiagnosisData>>({
        servi_id: service.id,
        diagnosis: '',
        repair_time: '',
        cost: undefined,
    });
    const formatedReasons = reasons.map(r => ({
        value: r.id,
        label: r.reason_note,
        color: '#0052CC'
    }));

    const addDiagnosis = async () => {
        showLoading();
        try {
            const response = await createDiagnosis(
                data,
                selectedReasons,
                notificateClient,
                notificateTechnician
            );

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
        } finally {
            hideLoading();
        }

    }
    const aproveSparePart = async () => {
        showLoading();
        try {
            const response = await toAproveSpareParts(service.id);
            success(response.message);
            router.visit('/service');
            closeModal();
        } catch (error: any) {
            const response = error.response?.data;
            if (error.response?.status === 422) {
                setError(response.errors);
                return;
            }

            if (error.response?.status === 500) {
                error(response.message);
                setError('diagnosis', 'error');
                closeModal();
                return;
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
                    closeMenuOnSelect={false}
                    isMulti
                    tabIndex={1}
                    name="reason-select"
                    options={formatedReasons}
                    classNamePrefix="reason-select"
                    styles={selectStyle}
                    onChange={(value) => setSelectedReasons(value)}
                />

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
                        value={data.cost}
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
                        id="isNotificable"
                        className="h-4 w-4 rounded border-gray-300 bg-transparent text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        checked={notificateTechnician}
                        onChange={(e) => setNotificateTechnician(e.target.checked)}
                        tabIndex={5}
                    />

                    <label htmlFor="isNotificable" className="ml-2 text-sm text-gray-900 select-none dark:text-white">
                        Enviar avances a mi correo
                    </label>
                </div>
                <ServiceImages initialFiles={service.file} serviceId={service.id} />
                <Button type="button" className="mt-4 w-full" tabIndex={7} disabled={processing} onClick={() => addDiagnosis()}>
                    Crear Diagnostico
                </Button>
                <Button type="button" className="mt-4 w-full" tabIndex={8} disabled={processing} onClick={() => aproveSparePart()}>
                    Continuar sin diagnositco
                </Button>
            </form>
        </React.Fragment>
    );
}
