import { axiosInstance } from "../api/axiosInstance"

export const getTypeService = async (organization_id) => {
    const response = await axiosInstance.post('/get-list-count-services', {organization_id: organization_id});
    return response.data
}

[   
    {"count": 0, "label": "Recepción", "slug": "recepcionados"}, 
    {"count": 0, "label": "Diagnóstico", "slug": "diagnosticados"}, 
    {"count": 1, "label": "Repuestos", "slug": "repuestos"}, 
    {"count": 0, "label": "En reparacion", "slug": "en-reparacion"}, 
    {"count": 0, "label": "Reparados", "slug": "reparados"}, 
    {"count": 1, "label": "Entregados", "slug": "entregados"}
]