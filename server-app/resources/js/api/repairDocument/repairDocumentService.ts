import { DocumentFilters } from "@/types";
import axios from "axios";

export const getDocuments = async (
    filters: DocumentFilters
) => {

    const response = await axios.get(
        "/reports/filter",
        {
            params: filters
        }
    );

    return response.data;
};