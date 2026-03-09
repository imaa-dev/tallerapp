<?php

namespace App\DTO;

class ServiceResultFile
{
    public bool $success;
    public int $code;
    public string $message;
    public array $files;

    public function __construct(
        bool $success,
        int $code,
        string $message,
        array $files = []
    ) {
        $this->success = $success;
        $this->code = $code;
        $this->message = $message;
        $this->files = $files;
    }

    public static function success(array $files, string $message = 'OK', int $code = 200): self {
        return new self(true, $code, $message, $files);
    }

    public static function fail(string $message, int $code = 400): self {
        return new self(false, $code, $message, []);
    }
}
