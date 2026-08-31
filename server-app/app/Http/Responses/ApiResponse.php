<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as HttpStatus;

final class ApiResponder
{
    public function success(
        mixed $data = null,
        ?string $message = null,
        int $status = HttpStatus::HTTP_OK,
        array $meta = [],
    ): JsonResponse {
        $body = ['data' => $data];

        if ($message !== null) {
            $body['message'] = $message;
        }

        if ($meta !== []) {
            $body['meta'] = $meta;
        }

        return response()->json($body, $status);
    }

    public function created(
        mixed $data,
        string $message = 'Recurso creado correctamente.',
    ): JsonResponse {
        return $this->success(
            data: $data,
            message: $message,
            status: HttpStatus::HTTP_CREATED,
        );
    }

    public function error(
        string $code,
        string $message,
        int $status = HttpStatus::HTTP_BAD_REQUEST,
        array $errors = [],
    ): JsonResponse {
        $body = [
            'code' => $code,
            'message' => $message,
        ];

        if ($errors !== []) {
            $body['errors'] = $errors;
        }

        return response()->json($body, $status);
    }

    public function noContent(): Response
    {
        return response()->noContent();
    }
}
