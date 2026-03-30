<?php

namespace App\DTO;

class ServiceResult
{
    public bool $success;
    public int $code;
    public string $message;
    public mixed $data;

    public function __construct(
        bool $success,
        int $code,
        string $message,
        mixed $data = null
    ) {
        $this->success = $success;
        $this->code = $code;
        $this->message = $message;
        $this->data = $data;
    }

    public static function success($data, string $message = 'OK', int $code = 200): self {
        return new self(true, $code, $message, $data);
    }

    public static function fail(string $message, int $code = 400): self {
        return new self(false, $code, $message, null);
    }
}
