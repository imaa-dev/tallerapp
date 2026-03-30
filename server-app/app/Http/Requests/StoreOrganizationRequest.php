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
                 'active' => [
                        'required',
                        'boolean',
                        function ($attribute, $value, $fail) {

                            if ($value) {
                                $exists = \App\Models\Organization::where('active', true)->where('user_id', $this->user()->id)
                                    ->when($this->id, function ($query) {
                                        $query->where('id', '!=', $this->id);
                                    })
                                    ->exists();
                                if ($exists) {
                                    $fail('Ya existe otro registro activo.');
                                }
                            }
                        },
                    ],
            'file' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048'
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
            'active.required' => 'El activo es requerido',
        ];
    }
}
