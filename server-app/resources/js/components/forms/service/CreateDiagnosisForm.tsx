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
    const [ reasons, setReasons ] = useState(service.reasons);
    const [ notificate, setNotificate ] = useState<boolean>(false);
    const [ selectedReasons, setSelectedReasons ] = useState([]);
    const { data, setData, errors, processing, setError } = useForm<Required<DiagnosisData>>({
        servi_id: service.id,
        diagnosis: '',
        repairTime: '',
        cost: 0,
    });
    const formatedReasons = reasons.map(r => ({
        value: r.id,
        label: r.reason_note,
        color: '#0052CC'
    }));

    const addDiagnosis = async () => {
        showLoading();
        const response = await createDiagnosis(data, selectedReasons, notificate);
        console.log(response)
        hideLoading();
        closeModal();
        if(response.code === 201){
            success(response.message);
            router.visit('/list-to-aprove-spare-part/service');
        }
        if(response.code === 500){
            error(response.message)
            setError('diagnosis', 'error')
        }
    }
    const aproveSparePart = async () => {
        showLoading();
        const response = await toAproveSpareParts(service.id);
        hideLoading();
        closeModal();
        if(response.code === 200){
            success(response.message);
            router.visit('/list-to-aprove-spare-part/service')
        }
        if(response.code == 500){
            error(response.message);
        }
    }

    return(
        <React.Fragment>
            <form
                className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800 overflow-y-auto max-h-[70vh]"
            >
                <SidebarGroupLabel> Diagnostico del servicio a reparar </SidebarGroupLabel>

                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    tabIndex={1}
                    name="reason-select"
                    options={formatedReasons}
                    classNamePrefix="reason-select"
                    styles={ selectStyle }
                    onChange={(value) => setSelectedReasons(value)}
                />

                <div className="group relative z-0 mb-5 w-full" >
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
                    <label
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"

                    >
                        Diagnostico <span className="text-red-500" >*</span>
                    </label>
                    <InputError message={errors.diagnosis} />
                </div>
                <div className="group relative z-0 mb-5 w-full" >
                    <input
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                        type="text"
                        name="repairTime"
                        id="repairTime"
                        required
                        tabIndex={3}
                        autoComplete="repairTime"
                        value={data.repairTime}
                        onChange={(e) => setData('repairTime', e.target.value)}
                    />
                    <label
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"

                    >
                        Tiempo<span className="text-red-500" >*</span>
                    </label>
                    <InputError message={errors.repairTime} />
                </div>
                <div className="group relative z-0 mb-5 w-full" >
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
                    <label
                        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"

                    >
                        Costo <span className="text-red-500" >*</span>
                    </label>
                    <InputError message={errors.cost} />
                </div>
                <div className="group relative z-0 mb-5 w-full flex items-center">
                    <input
                        type="checkbox"
                        name="isNotificable"
                        id="isNotificable"
                        className="h-4 w-4 text-blue-600 bg-transparent border-gray-300 rounded
                        focus:ring-blue-600 dark:border-gray-600 dark:focus:ring-blue-500"
                        checked={notificate}
                        onChange={(e) => setNotificate(e.target.checked)}
                        tabIndex={5}
                    />

                    <label
                        htmlFor="isNotificable"
                        className="ml-2 text-sm text-gray-900 dark:text-white select-none"
                    >
                        ¿Mostrar avances al cliente?
                    </label>
                </div>
                <ServiceImages initialFiles={service.file} serviceId={service.id} />
                <Button
                    type="button"
                    className="mt-4 w-full"
                    tabIndex={7}
                    disabled={processing}
                    onClick={() => addDiagnosis()}
                >
                    Crear Diagnostico
                </Button>
                <Button
                    type="button"
                    className="mt-4 w-full"
                    tabIndex={8}
                    disabled={processing}
                    onClick={() => aproveSparePart()}
                >
                    Continuar sin diagnositco
                </Button>
            </form>
        </React.Fragment>
    );
}
