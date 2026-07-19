<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    public function register(): void
    {
        $this->renderable(function (Throwable $e, Request $request) {

            // Solo formateamos si es JSON: API, App RN o Inertia
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return $this->buildJsonResponse($e, $request);
            }
        });
    }

    private function buildJsonResponse(Throwable $e, Request $request)
    {
        $status = 500;
        $message = 'Error interno del servidor';
        $errors = null;

        // 1. Validación 422
        if ($e instanceof ValidationException) {
            $status = 422;
            $message = 'Los datos enviados no son válidos';
            $errors = $e->errors();
        }

        // 2. No encontrado 404
        elseif ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
            $status = 404;
            $message = 'Recurso no encontrado';
        }

        // 3. No autorizado 401
        elseif ($e instanceof AuthenticationException) {
            $status = 401;
            $message = 'No autenticado';
        }

        // 4. Forbidden 403
        elseif (method_exists($e, 'getStatusCode')) {
            $status = $e->getStatusCode();
            if ($status === 403) {
                $message = 'No tienes permiso para realizar esta acción';
            }
        }

        // 5. Otros errores 500: en prod no mostrar el mensaje real
        else {
            $message = config('app.debug') ? $e->getMessage() : 'Error interno del servidor';
        }

        $traceId = (string) Str::uuid();

        // Loguear el error con el trace_id para buscarlo fácil
        \Log::error('API Error', [
            'trace_id' => $traceId,
            'message'  => $e->getMessage(),
            'file'     => $e->getFile(),
            'line'     => $e->getLine(),
            'url'      => $request->fullUrl(),
            'user_id'  => $request->user()?->id,
        ]);

        return response()->json([
            'status'  => $status >= 500 ? 'error' : 'fail',
            'message' => $message,
            'data'    => null,
            'errors'  => $errors,
            'meta'    => [
                'trace_id'  => $traceId,
                'timestamp' => now()->toISOString(),
                'debug'     => config('app.debug') ? [
                    'exception' => get_class($e),
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                ] : null
            ]
        ], $status);
    }
}
