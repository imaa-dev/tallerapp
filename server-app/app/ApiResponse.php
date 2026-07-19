<?php

namespace App;

trait ApiResponse
{
    protected function success($data = null, string $message = 'OK', int $code = 200, $meta = null)
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data,
            'errors'  => null,
            'meta'    => $meta,
        ], $code);
    }

    protected function fail($errors, string $message = 'Validation Error', int $code = 422)
    {
        return response()->json([
            'status'  => 'fail',
            'message' => $message,
            'data'    => null,
            'errors'  => $errors,
            'meta'    => null,
        ], $code);
    }

    protected function error(string $message = 'Server Error', int $code = 500, $meta = null)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'data'    => null,
            'errors'  => null,
            'meta'    => $meta,
        ], $code);
    }
}
