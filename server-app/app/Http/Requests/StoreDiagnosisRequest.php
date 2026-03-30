<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiagnosisRequest extends FormRequest
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
            'servi_id' => ['required'],
            'diagnosis' => ['required'],
            'repair_time' => ['required'],
            'cost' => ['required']
        ];
    }

    public function messages(): array
    {
        return [
            'service_id.required' => 'El servicio es requerido',
            'diagnosis' => 'El diagnostico es requerido',
            'repair_time' => 'EL tiempo de reparacion es requerido',
            'cost' => 'El costo de la reparacion es requerido',
        ];
    }
}
