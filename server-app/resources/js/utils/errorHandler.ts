import { AxiosError } from "axios";

export function errorHandler(error: AxiosError | unknown) {

    if (error instanceof AxiosError) {
        // ❗ Validation errors 422
        if (error.response?.status === 422) {
            return {
                success: false,
                code: 422,
                message: error.response?.data?.message ?? "Validation error",
                errors: error.response?.data?.errors ?? null,
            };
        }

        // ❗ Server not available / network failures
        if (error.code === "ERR_NETWORK") {
            return {
                success: false,
                code: 503,
                message: "Servidor no disponible, 404",
            };
        }

        // ❗ Bad response from backend
        if (error.code === "ERR_BAD_RESPONSE") {
            return {
                success: false,
                code: error.response?.status ?? 500,
                message: error.response?.data?.message ?? "Error inesperado",
            };
        }

        // ❗ Any other backend error (400, 404, 500...)
        if (error.response) {
            return {
                success: false,
                code: error.response.status,
                message: error.response.data?.message ?? "Error",
            };
        }
    }

    // ❗ If it's not Axios
    return {
        success: false,
        code: 500,
        message: "Error desconocido",
    };
}
