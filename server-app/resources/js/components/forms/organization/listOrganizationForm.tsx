import { OrganizationData, User } from "@/types";
import React from "react";
import { Button } from '@/components/ui/button';
import { useToast } from "@/context/ToastContext";
import { useModal } from "@/context/ModalContextForm";
import { useLoading } from "@/context/LoadingContext";
import { useForm, router } from "@inertiajs/react";
import storeOrganizationUser from "@/api/organizationUser/organizationUser";

interface DataProp{
    user: User,
    organizations: OrganizationData[]
}

interface UserOrganization {
    userId: number,
    organizationId: number
}

const ListOrganizationForm =  ( {user, organizations }: DataProp ) => {
    
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const { data, setData, errors, processing, setError } = useForm<Required<UserOrganization>>({
        userId: user.id,
        organizationId: 0
    })

    const addTechnician = async () => {
        console.log(data)
        showLoading();
        const response = await storeOrganizationUser(data);
        console.log(response)
        hideLoading();
        if(response.code === 201 && response.message === 'Usuario Tecnico agregado satisfactoriamente a organizacion'){
            success(response.message)
            router.visit('/users');
        }
        if(response.code === 422){
            setError(response.message)
            error('Error de validación de datos')
        }
        if(response.code === 500 && typeof response.message === 'string'){
            error(response.message)
        }
        if(response.code === 503 && typeof response.message === 'string'){
            error(response.message)
            closeModal()
        }
        closeModal()
    }
    
    return(
        <React.Fragment>
            <form className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <div>
                    <h3> Asignar organizacion a {user.name} </h3>
                </div>
                <select
                    id="organization"
                    name="organization_id"
                    tabIndex={1}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    onChange={(e) => {
                        setData("organizationId", Number(e.target.value))
                    }}
                >
                    <option value="">Selecciona un Organizacion</option>
                    {organizations.map((organization, index) => (
                        <option key={index} value={organization.id}>
                            {organization.name} 
                        </option>
                    ))}
                </select>
                <Button
                    type="button"
                    className="mt-4 w-full"
                    tabIndex={2}
                    onClick={() => addTechnician() }
                >
                    Asignar
                </Button>
            </form>
        </React.Fragment>
    )
} 

export default ListOrganizationForm;