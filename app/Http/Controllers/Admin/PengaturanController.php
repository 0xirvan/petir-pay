<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('admin/pengaturan', [
            'title' => 'Pengaturan Akun',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'photo_profile' => $user->photo_profile,
                'photo_profile_url' => $user->photo_profile_url,
                'created_at' => $user->created_at->format('d M Y'),
                'email_verified_at' => $user->email_verified_at,
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
        ], [
            'name.required' => 'Nama harus diisi.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return back()->with('success', 'Profil berhasil diperbarui!');
    }

    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.required' => 'Password saat ini harus diisi.',
            'password.required' => 'Password baru harus diisi.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->getOriginal('password'))) {
            return back()->withErrors([
                'current_password' => 'Password saat ini tidak benar.'
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password berhasil diperbarui!');
    }

    public function updatePhoto(Request $request)
    {
        $user = auth()->user();


        if (!$request->hasFile('photo')) {
            return back()->withErrors(['photo' => 'Tidak ada file yang dikirim.']);
        }

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'photo.required' => 'Foto harus dipilih.',
            'photo.image' => 'File harus berupa gambar.',
            'photo.mimes' => 'Format foto harus jpeg, png, jpg, atau gif.',
            'photo.max' => 'Ukuran foto maksimal 2MB.',
        ]);

        try {
            // Delete old photo if exists
            if ($user->photo_profile) {
                Storage::disk('public')->delete($user->photo_profile);
            }

            // Upload new photo
            $file = $request->file('photo');
            $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());

            $path = $file->storeAs('profile-photos', $filename, 'public');


            $user->update([
                'photo_profile' => $path,
            ]);


            return back()->with('success', 'Foto profil berhasil diperbarui!');

        } catch (\Exception $e) {

            return back()->withErrors(['photo' => 'Gagal mengunggah foto: ' . $e->getMessage()]);
        }
    }

    public function deletePhoto()
    {
        $user = auth()->user();

        if ($user->photo_profile) {
            Storage::disk('public')->delete($user->photo_profile);

            $user->update([
                'photo_profile' => null,
            ]);

            return back()->with('success', 'Foto profil berhasil dihapus!');
        }

        return back()->with('error', 'Tidak ada foto profil untuk dihapus.');
    }
}
