import api from '@/api/AxiosIntance';
import { FileResponse } from '@/types';

const deleteImage = async (id: number): Promise<{ code: number; message: string; success: boolean }> => {
    try {
        const response = await api.delete(`/delete-image-service/${id}`)
        return response.data
    } catch (error: unknown) {
        console.log(error, "AXIOS ERROR")
        return {
            code: 500,
            message: 'Error desconocido',
            success: false
        };
    }
}
 const uploadImages = async (file: File[], id: number): Promise<FileResponse> => {
    const formData = new FormData();
    file.forEach(file => formData.append('file[]', file));
    formData.append('service_id', id.toString())
    try {
        const response = await api.post(`/upload-image-service`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error) {
        console.log(error, "AXIOS ERROR")
        return {
            code: 500,
            message: 'Error',
            success: false,
            files: []
        }
    }
}

export { uploadImages, deleteImage }
