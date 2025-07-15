import { DeleteDialog } from '@/components/delete-dialog';
import { FormDialog } from '@/components/form-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { Edit, Search, Shield, Trash2, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Admin {
    id: number;
    name: string;
    email: string;
    role: string;
    photo_profile_url: string;
    created_at: string;
    last_login: string;
}

interface PaginationData {
    data: Admin[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface KelolaAdminProps {
    title: string;
    adminList: PaginationData;
    statistics: {
        total_administrator: number;
        total_petugas: number;
        total_users: number;
    };
    filters?: {
        search?: string;
        per_page?: number;
    };
}

const getRoleBadge = (role: string) => {
    switch (role) {
        case 'administrator':
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Administrator</Badge>;
        case 'petugas':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Petugas</Badge>;
        default:
            return <Badge variant="secondary">{role}</Badge>;
    }
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
};

export default function KelolaAdmin({ adminList, title, statistics, filters }: KelolaAdminProps) {
    const { props } = usePage<{ adminBaru?: Admin }>();
    const [adminListState, setAdminListState] = useState(adminList);
    const [search, setSearch] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    useEffect(() => {
        if (props.adminBaru) {
            setAdminListState((prev) => ({
                ...prev,
                data: [props.adminBaru!, ...prev.data],
                total: prev.total + 1,
            }));
        }
    }, [props.adminBaru]);

    useEffect(() => {
        setAdminListState(adminList);
    }, [adminList]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.kelola-admin'), {
            search: search,
            per_page: perPage,
        });
    };

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        router.get(route('admin.kelola-admin'), {
            search: search,
            per_page: parseInt(value),
        });
    };

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Kelola Admin & Petugas</h1>
                        <p className="text-gray-600">Manage administrator dan petugas sistem</p>
                    </div>

                    <FormDialog
                        title="Tambah Petugas Baru"
                        description="Tambahkan petugas baru ke sistem"
                        fields={[
                            { id: 'name', label: 'Nama Lengkap', placeholder: 'Contoh: John Doe', required: true },
                            { id: 'email', label: 'Email', placeholder: 'Contoh: petugas@petirpay.id', required: true, type: 'email' },
                            { id: 'password', label: 'Password', placeholder: 'Minimal 8 karakter', required: true, type: 'password' },
                            {
                                id: 'password_confirmation',
                                label: 'Konfirmasi Password',
                                placeholder: 'Ulangi password',
                                required: true,
                                type: 'password',
                            },
                            {
                                id: 'role',
                                label: 'Role',
                                type: 'select',
                                required: true,
                                defaultValue: 'petugas',
                                options: [{ value: 'petugas', label: 'Petugas' }],
                            },
                        ]}
                        triggerText="Tambah Petugas"
                        submitText="Simpan Petugas"
                        action={route('admin.kelola-admin.store')}
                        method="post"
                    />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Administrator</p>
                                    <p className="text-2xl font-bold text-red-600">{statistics.total_administrator}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                                    <Shield className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Petugas</p>
                                    <p className="text-2xl font-bold text-blue-600">{statistics.total_petugas}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-green-600">{statistics.total_users}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-medium text-gray-700">Cari Admin</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari nama atau email admin..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Per Halaman</label>
                                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="flex items-center space-x-2">
                                <Search className="h-4 w-4" />
                                <span>Cari</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Admin Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900">
                            Daftar Admin & Petugas ({adminListState.from}-{adminListState.to} dari {adminListState.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-200 bg-gray-50">
                                        <TableHead className="font-semibold text-gray-700">Admin</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Role</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Terdaftar</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Last Login</TableHead>
                                        <TableHead className="text-center font-semibold text-gray-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminListState.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                                Belum ada data admin
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        adminListState.data.map((admin) => (
                                            <TableRow key={admin.id} className="border-gray-100 hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={admin.photo_profile_url} alt={admin.name} />
                                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                                                {getInitials(admin.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{admin.name}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{admin.email}</TableCell>
                                                <TableCell>{getRoleBadge(admin.role)}</TableCell>
                                                <TableCell className="text-gray-600">{admin.created_at}</TableCell>
                                                <TableCell className="text-gray-600">{admin.last_login}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center space-x-2">
                                                        {admin.role === 'administrator' ? (
                                                            // Administrator tidak bisa diedit/dihapus
                                                            <div className="flex space-x-2">
                                                                <Button size="sm" variant="outline" disabled>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="outline" disabled className="text-gray-400">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            // Petugas bisa diedit/dihapus
                                                            <>
                                                                <FormDialog
                                                                    title="Edit Petugas"
                                                                    description="Perbarui informasi petugas"
                                                                    fields={[
                                                                        {
                                                                            id: 'name',
                                                                            label: 'Nama Lengkap',
                                                                            defaultValue: admin.name,
                                                                            required: true,
                                                                        },
                                                                        {
                                                                            id: 'email',
                                                                            label: 'Email',
                                                                            defaultValue: admin.email,
                                                                            required: true,
                                                                            type: 'email',
                                                                        },
                                                                        {
                                                                            id: 'password',
                                                                            label: 'Password Baru',
                                                                            placeholder: 'Kosongkan jika tidak ingin mengubah',
                                                                            type: 'password',
                                                                        },
                                                                        {
                                                                            id: 'password_confirmation',
                                                                            label: 'Konfirmasi Password',
                                                                            placeholder: 'Ulangi password baru',
                                                                            type: 'password',
                                                                        },
                                                                        {
                                                                            id: 'role',
                                                                            label: 'Role',
                                                                            type: 'select',
                                                                            required: true,
                                                                            defaultValue: admin.role,
                                                                            options: [{ value: 'petugas', label: 'Petugas' }],
                                                                        },
                                                                    ]}
                                                                    triggerText="Edit"
                                                                    submitText="Update Petugas"
                                                                    action={route('admin.kelola-admin.update', admin.id)}
                                                                    method="put"
                                                                    trigger={
                                                                        <Button size="sm" variant="outline">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    }
                                                                />

                                                                <DeleteDialog
                                                                    title="Hapus Petugas"
                                                                    description={`Apakah Anda yakin ingin menghapus petugas ${admin.name}? Tindakan ini tidak dapat dibatalkan.`}
                                                                    action={route('admin.kelola-admin.destroy', admin.id)}
                                                                    trigger={
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    }
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {adminListState.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {adminListState.from} sampai {adminListState.to}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={adminListState.current_page === 1}
                                        onClick={() =>
                                            router.get(route('admin.kelola-admin'), {
                                                search: search,
                                                per_page: perPage,
                                                page: adminListState.current_page - 1,
                                            })
                                        }
                                    >
                                        ← Sebelumnya
                                    </Button>

                                    {/* Page Numbers */}
                                    <div className="flex space-x-1">
                                        {(() => {
                                            const currentPage = adminListState.current_page;
                                            const lastPage = adminListState.last_page;
                                            const pages = [];

                                            // Always show first page
                                            if (currentPage > 3) {
                                                pages.push(1);
                                                if (currentPage > 4) {
                                                    pages.push('...');
                                                }
                                            }

                                            // Show pages around current page
                                            for (let i = Math.max(1, currentPage - 2); i <= Math.min(lastPage, currentPage + 2); i++) {
                                                pages.push(i);
                                            }

                                            // Always show last page
                                            if (currentPage < lastPage - 2) {
                                                if (currentPage < lastPage - 3) {
                                                    pages.push('...');
                                                }
                                                pages.push(lastPage);
                                            }

                                            return pages.map((page, index) =>
                                                page === '...' ? (
                                                    <span key={index} className="px-3 py-1 text-gray-500">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <Button
                                                        key={page}
                                                        variant={page === currentPage ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() =>
                                                            router.get(route('admin.kelola-admin'), {
                                                                search: search,
                                                                per_page: perPage,
                                                                page: page,
                                                            })
                                                        }
                                                    >
                                                        {page}
                                                    </Button>
                                                ),
                                            );
                                        })()}
                                    </div>

                                    {/* Next Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={adminListState.current_page === adminListState.last_page}
                                        onClick={() =>
                                            router.get(route('admin.kelola-admin'), {
                                                search: search,
                                                per_page: perPage,
                                                page: adminListState.current_page + 1,
                                            })
                                        }
                                    >
                                        Selanjutnya →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
