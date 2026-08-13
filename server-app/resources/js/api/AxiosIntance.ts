import { appUrl } from '@/config/env';
import { router } from '@inertiajs/react';
import axios, { AxiosError, AxiosInstance } from 'axios';
import toast from 'react-hot-toast';

const SUBSCRIPTION_ERROR_CODES = ['ORGANIZATION_SUSPENDED', 'ORGANIZATION_CANCELLED', 'ORGANIZATION_EXPIRED', 'ORGANIZATION_PAYMENT_PENDING'];

const api: AxiosInstance = axios.create({
    baseURL: appUrl,
});

let redirectingToSubscription = false;

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status;
        const data = error.response?.data as { code?: string; message?: string } | undefined;

        if (status === 403 && data?.code && SUBSCRIPTION_ERROR_CODES.includes(data.code)) {
            toast.error(data.message ?? 'Su suscripción no se encuentra activa.');

            if (!redirectingToSubscription) {
                redirectingToSubscription = true;
                router.visit('/payments-subscriptions');
            }
        }

        return Promise.reject(error);
    },
);

export default api;
