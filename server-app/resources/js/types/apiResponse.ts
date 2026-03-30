import { Client } from '@/types/index';

export type ValidationErrors<T> = Partial<Record<keyof T, string | string[]>>;

export type ApiSuccess<T> = {
    success: true;
    code: number;
    message: string;
    data: T;
};

export type ApiValidationError<T> = {
    success: false;
    code: 422;
    message: string;
    errors: ValidationErrors<T>;
};

export type ApiServerError = {
    success: false;
    code: number;
    message: string;
    client: Client;
};

export type ApiResponse<T, E = unknown> =
    | ApiSuccess<T>
    | ApiValidationError<E>
    | ApiServerError ;

export function normalizeLaravelErrors<T>(
    errors: ValidationErrors<T>
): Record<keyof T, string> {
    return Object.fromEntries(
        Object.entries(errors ?? {}).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value ?? '',
        ])
    ) as Record<keyof T, string>;
}
