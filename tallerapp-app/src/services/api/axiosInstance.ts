import axios from "axios"
import { getToken } from "@/utils/secureStorage"
import { API_URL } from "@/config/env"

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type" : "application/json",
    },
})

axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken();

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})