<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es requerido',
            'name.string' => 'El nombre debe ser una cadena de caracteres',
            'name.max' => 'El nombre debe tener maximo de 255 caracteres',
            'phone.required' => 'El telefono es requerido',
            'phone.string' => 'El telefono debe ser una cadena de caracteres',
            'phone.max' => 'El telefono debe tener maximo de 11 caracteres',
            'phone.unique' => 'El telefono ya esta registrado',
            'email.unique' => 'El correo ya esta registrado',
            'email.email' => 'El correo debe ser un correo valido',
        ];
    }
}
