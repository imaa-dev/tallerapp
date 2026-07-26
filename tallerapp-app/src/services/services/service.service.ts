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

    const reasonNotes = data.reason_notes
        .map((item) => item.reason_note?.trim())
        .filter((note): note is string => Boolean(note));

    if (reasonNotes.length > 0) {
        formData.append("reason_notes", JSON.stringify(reasonNotes));
        formData.append("reason", reasonNotes.join(" | "));

        reasonNotes.forEach((note, index) => {
            formData.append(`reason_notes[${index}][reason_note]`, note);
        });
    }

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