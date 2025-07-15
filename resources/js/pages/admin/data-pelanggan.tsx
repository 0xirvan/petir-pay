import { DeleteDialog } from '@/components/delete-dialog';
import { FormDialog } from '@/components/form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import ResponsivePagination from '@/components/ui/responsive-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Link, router } from '@inertiajs/react';
import { Download, Edit, Eye, Plus, Search, Trash2, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Tarif {
    id: number;
    daya: number;
    tarif_per_kwh: number;
    deskripsi?: string;
    jenis?: string;
}

interface Pelanggan {
    id: number;
    nama: string;
    email: string;
    nomor_meter: string;
    alamat: string;
    tarif?: Tarif;
    created_at: string;
}

interface PaginationData {
    data: Pelanggan[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface DataPelangganProps {
    title: string;
    pelanggan: PaginationData;
    tarifs: Tarif[];
    filters: {
        search: string;
        per_page: number;
    };
    stats: {
        total_pelanggan: number;
        total_tarif_900va: number;
        total_tarif_1300va: number;
        total_tarif_2200va: number;
    };
}

export default function DataPelanggan({ title, pelanggan, tarifs, filters, stats }: DataPelangganProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [selectedPelanggan, setSelectedPelanggan] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Handle select all
    useEffect(() => {
        if (selectAll) {
            setSelectedPelanggan(pelanggan.data.map((p) => p.id));
        } else {
            setSelectedPelanggan([]);
        }
    }, [selectAll, pelanggan.data]);

    // Handle individual selection
    const handleSelectPelanggan = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedPelanggan((prev) => [...prev, id]);
        } else {
            setSelectedPelanggan((prev) => prev.filter((pelId) => pelId !== id));
            setSelectAll(false);
        }
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.data-pelanggan'),
            {
                search: search,
                per_page: perPage,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        setPerPage(parseInt(value));
        router.get(
            route('admin.data-pelanggan'),
            {
                search: search,
                per_page: value,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Handle export selected
    const handleExportSelected = () => {
        if (selectedPelanggan.length === 0) {
            alert('Pilih minimal satu pelanggan untuk export');
            return;
        }

        // Create a form and submit it to trigger download
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.data-pelanggan.export-selected');
        form.style.display = 'none';

        // Add CSRF token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        form.appendChild(csrfInput);

        // Add selected IDs
        selectedPelanggan.forEach((id) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'selected_ids[]';
            input.value = id.toString();
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const getTarifBadge = (tarif?: Tarif) => {
        if (!tarif) return <Badge variant="secondary">-</Badge>;

        const color =
            tarif.daya === 900 ? 'bg-green-100 text-green-800' : tarif.daya === 1300 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

        return <Badge className={color}>{tarif.daya}VA</Badge>;
    };

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Data Pelanggan</h1>
                        <p className="text-gray-600">Kelola data pelanggan listrik</p>
                    </div>

                    <div className="flex gap-2">
                        {selectedPelanggan.length > 0 && (
                            <Button onClick={handleExportSelected} className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700">
                                <Download className="h-4 w-4" />
                                <span>Export Terpilih ({selectedPelanggan.length})</span>
                            </Button>
                        )}

                        <Button
                            onClick={() => window.open(route('admin.data-pelanggan.export-all'), '_blank')}
                            className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export Semua</span>
                        </Button>

                        <FormDialog
                            title="Tambah Pelanggan Baru"
                            description="Tambahkan pelanggan baru ke sistem"
                            fields={[
                                { id: 'nama', label: 'Nama Lengkap', placeholder: 'Contoh: John Doe', required: true },
                                { id: 'email', label: 'Email', placeholder: 'Contoh: customer@email.com', required: true, type: 'email' },
                                { id: 'password', label: 'Password', placeholder: 'Minimal 8 karakter', required: true, type: 'password' },
                                {
                                    id: 'password_confirmation',
                                    label: 'Konfirmasi Password',
                                    placeholder: 'Ulangi password',
                                    required: true,
                                    type: 'password',
                                },
                                { id: 'nomor_meter', label: 'Nomor Meter', placeholder: 'Contoh: 12345678901', required: true },
                                { id: 'alamat', label: 'Alamat', placeholder: 'Alamat lengkap pelanggan', required: true },
                                {
                                    id: 'id_tarif',
                                    label: 'Tarif',
                                    type: 'select',
                                    required: true,
                                    options: tarifs.map((t) => ({
                                        value: t.id.toString(),
                                        label: `${t.daya}VA - Rp ${new Intl.NumberFormat('id-ID').format(t.tarif_per_kwh)}/kWh`,
                                    })),
                                },
                            ]}
                            triggerText="Tambah Pelanggan"
                            submitText="Simpan Pelanggan"
                            action={route('admin.data-pelanggan.store')}
                            method="post"
                        />
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Pelanggan</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.total_pelanggan}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pelanggan Aktif</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.total_pelanggan}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Daya Terpasang</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {(
                                            stats.total_tarif_900va * 900 +
                                            stats.total_tarif_1300va * 1300 +
                                            stats.total_tarif_2200va * 2200
                                        ).toLocaleString('id-ID')}{' '}
                                        VA
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                                    <Zap className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Rata-rata per Hari</p>
                                    <p className="text-2xl font-bold text-indigo-600">{Math.round(stats.total_pelanggan / 30)}</p>
                                    <p className="text-xs text-gray-500">pelanggan baru</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                    <Plus className="h-6 w-6 text-indigo-600" />
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
                                <label className="mb-2 block text-sm font-medium text-gray-700">Cari Pelanggan</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Cari nama, email, nomor meter, atau alamat..."
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

                {/* Pelanggan Table */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900">Daftar Pelanggan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-200 bg-gray-50">
                                        <TableHead className="w-12">
                                            <Checkbox checked={selectAll} onCheckedChange={(checked) => setSelectAll(checked as boolean)} />
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700">Pelanggan</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                        <TableHead className="font-semibold text-gray-700">No. Meter</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Alamat</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Tarif</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Terdaftar</TableHead>
                                        <TableHead className="text-center font-semibold text-gray-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pelanggan.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                                Belum ada data pelanggan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pelanggan.data.map((p) => (
                                            <TableRow key={p.id} className="border-gray-100 hover:bg-gray-50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedPelanggan.includes(p.id)}
                                                        onCheckedChange={(checked) => handleSelectPelanggan(p.id, checked as boolean)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{p.nama}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{p.email}</TableCell>
                                                <TableCell className="font-mono text-gray-600">{p.nomor_meter}</TableCell>
                                                <TableCell className="max-w-xs truncate text-gray-600">{p.alamat}</TableCell>
                                                <TableCell>{getTarifBadge(p.tarif)}</TableCell>
                                                <TableCell className="text-gray-600">{new Date(p.created_at).toLocaleDateString('id-ID')}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Link href={route('admin.data-pelanggan.show', p.id)}>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        <FormDialog
                                                            title="Edit Pelanggan"
                                                            description="Perbarui informasi pelanggan"
                                                            fields={[
                                                                { id: 'nama', label: 'Nama Lengkap', defaultValue: p.nama, required: true },
                                                                { id: 'email', label: 'Email', defaultValue: p.email, required: true, type: 'email' },
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
                                                                    id: 'nomor_meter',
                                                                    label: 'Nomor Meter',
                                                                    defaultValue: p.nomor_meter,
                                                                    required: true,
                                                                },
                                                                { id: 'alamat', label: 'Alamat', defaultValue: p.alamat, required: true },
                                                                {
                                                                    id: 'id_tarif',
                                                                    label: 'Tarif',
                                                                    type: 'select',
                                                                    required: true,
                                                                    defaultValue: p.tarif?.id.toString(),
                                                                    options: tarifs.map((t) => ({
                                                                        value: t.id.toString(),
                                                                        label: `${t.daya}VA - Rp ${new Intl.NumberFormat('id-ID').format(t.tarif_per_kwh)}/kWh`,
                                                                    })),
                                                                },
                                                            ]}
                                                            triggerText="Edit"
                                                            submitText="Update Pelanggan"
                                                            action={route('admin.data-pelanggan.update', p.id)}
                                                            method="put"
                                                            trigger={
                                                                <Button size="sm" variant="outline">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                        />

                                                        <DeleteDialog
                                                            title="Hapus Pelanggan"
                                                            description={`Apakah Anda yakin ingin menghapus ${p.nama}? Tindakan ini tidak dapat dibatalkan.`}
                                                            action={route('admin.data-pelanggan.destroy', p.id)}
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
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <ResponsivePagination data={pelanggan} routeName="admin.data-pelanggan" routeParams={{ search, per_page: perPage }} />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
