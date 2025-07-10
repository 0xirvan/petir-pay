<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class PelangganRegisterRequest extends FormRequest
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
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:pelanggan,email',
            'password' => 'required|min:8|confirmed',
            'nomor_meter' => 'required|string|unique:pelanggan,nomor_meter',
            'tarif_id' => 'required|exists:tarif,id',
            'alamat' => 'required|string',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama lengkap harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'nomor_meter.required' => 'Nomor meter harus diisi.',
            'nomor_meter.unique' => 'Nomor meter sudah terdaftar.',
            'tarif_id.required' => 'Daya listrik harus dipilih.',
            'tarif_id.exists' => 'Daya listrik tidak valid.',
        ];
    }
}
