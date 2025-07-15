<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ManageAdminController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $query = User::whereIn('role', ['administrator', 'petugas'])
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc');

        $admins = $query->paginate($perPage);


        $admins->getCollection()->transform(function ($admin) {
            return [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'photo_profile_url' => $admin->photo_profile_url,
                'created_at' => $admin->created_at->format('Y-m-d'),
                'last_login' => $admin->updated_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('admin/kelola-admin', [
            'title' => 'Kelola Admin',
            'adminList' => $admins,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['petugas'])],
        ], [
            'name.required' => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.required' => 'Role harus dipilih.',
            'role.in' => 'Hanya bisa membuat akun petugas.',
        ]);

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(),
        ]);

        return back()->with([
            'success' => 'Admin berhasil ditambahkan!',
            'adminBaru' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'photo_profile_url' => $admin->photo_profile_url,
                'created_at' => $admin->created_at->format('Y-m-d'),
                'last_login' => $admin->updated_at->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $admin = User::findOrFail($id);

        if ($admin->role === 'administrator') {
            return back()->with('error', 'Tidak dapat mengubah data administrator!');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($admin->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ['required', Rule::in(['petugas'])], // Hanya bisa update ke petugas
        ], [
            'name.required' => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.required' => 'Role harus dipilih.',
            'role.in' => 'Hanya bisa mengubah role ke petugas.',
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $admin->update($updateData);

        return back()->with('success', 'Admin atau Petugas berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $admin = User::findOrFail($id);


        if ($admin->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri!');
        }


        if ($admin->role === 'administrator') {
            return back()->with('error', 'Tidak dapat menghapus administrator!');
        }

        $admin->delete();

        return back()->with('success', 'Petugas berhasil dihapus!');
    }
}
