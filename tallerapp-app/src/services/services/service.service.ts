import { axiosInstance } from "../api/axiosInstance"
import {FormDataService} from "@/types/servi/servi.type";
import {appendImagesToFormData} from "@/utils/appendImagesToFormData";

export const createService = async (data: FormDataService) => {
    const formData = new FormData();

    appendImagesToFormData(
        formData,
        data.file
    );

    formData.append("user_id", String(data.client.value));
    formData.append("product_id", String(data.product.value));
    formData.append("status_id", String(1));
    const mysqlDate = data.date_entry
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
        .split(".")[0];
    formData.append(
        "date_entry",
        mysqlDate
    );

    data.reason_notes.forEach((item, index) => {
        formData.append(
            `reason_notes[${index}][reason_note]`,
            item.reason_note
        );
    });

    const response = await axiosInstance.post(
        "/create-service",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};