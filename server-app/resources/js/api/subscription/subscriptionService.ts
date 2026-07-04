import api from "../AxiosIntance";

export interface CreatePayPalSubscriptionResponse {
    subscription_id: string;
}
export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    errors?: Record<string, string[]>;
};
export const createPayPalSubscription = async (
    planId: number
): Promise<ApiResponse<{ subscription_id: string }>> => {

    const response = await api.post(
        "/paypal/subscriptions/create",
        {
            plan_id: planId,
        }
    );

    return response.data;
};