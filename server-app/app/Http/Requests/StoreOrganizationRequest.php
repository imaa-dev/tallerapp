<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'email' => 'nullable|email:rfc,dns|max:255',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'phone' => 'nullable|string|regex:/^\+?[0-9\s\-\(\)]{8,20}$/',
            'website' => 'nullable|url|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es requerido',
            'name.string' => 'El nombre debe ser una cadena de caracteres',
            'name.max' => 'El nombre debe tener mas de 255 caracteres',
            'description.required' => 'La descripcion es requerida',
            'description.string' => 'La descripcion debe ser una cadena de caracteres',
            'description.max' => 'La descripcion debe tener mas de 255 caracteres',
            'email.email' => 'Debe ingresar un correo electrónico válido.',
            'email.max' => 'El correo electrónico no puede superar los 255 caracteres.',
            'website.url' => 'Debe ingresar una URL válida (por ejemplo: https://example.com).',
            'website.max' => 'El sitio web no puede superar los 255 caracteres.',
            'file.file' => 'El archivo debe ser un archivo',
            'file.mimes' => 'El archivo debe ser una imagen',
            'file.max' => 'La imagen no puede superar los 2 MB.',
            'phone.regex' => 'Debe ingresar un número de teléfono válido.',
            'phone.max' => 'El teléfono no puede superar los 20 caracteres.',
        ];
    }
}
