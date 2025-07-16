import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ResponsivePagination from '@/components/ui/responsive-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/utils/utils';
import { router } from '@inertiajs/react';
import { Check, CheckCircle, Clock, Eye, Search, X, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Tarif {
    id: number;
    daya: number;
    tarif_per_kwh: number;
    deskripsi: string;
}

interface Pelanggan {
    id: number;
    nama: string;
    nomor_meter: string;
    email: string;
}

interface Tagihan {
    id: number;
    bulan: number;
    tahun: number;
    jumlah_meter: number;
    status: string;
    pelanggan: Pelanggan;
    tarif?: Tarif;
}

interface MetodePembayaran {
    id: number;
    nama: string;
    kode: string;
    biaya_admin: number;
}

interface Verifikator {
    id: number;
    name: string;
}

interface Pembayaran {
    id: number;
    tagihan: Tagihan;
    metode_pembayaran: MetodePembayaran;
    tanggal_pembayaran: string;
    total_bayar: number;
    bukti_transfer: string;
    bukti_transfer_url: string;
    status_verifikasi: string;
    catatan_verifikasi: string;
    tanggal_verifikasi: string;
    verifikator?: Verifikator;
    created_at: string;
}

interface PaginationData {
    data: Pembayaran[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface VerifikasiPembayaranProps {
    title: string;
    pembayaranList: PaginationData;
    filters: {
        search: string;
        status: string;
        per_page: number;
    };
    stats: {
        total_menunggu: number;
        total_disetujui: number;
        total_ditolak: number;
    };
}

export default function VerifikasiPembayaran({ title, pembayaranList, filters, stats }: VerifikasiPembayaranProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'menunggu');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    const handleSearch = () => {
        router.get(route('admin.verifikasi-pembayaran'), {
            search: search,
            status: status,
            per_page: perPage,
        });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        router.get(route('admin.verifikasi-pembayaran'), {
            search: search,
            status: newStatus,
            per_page: perPage,
        });
    };

    const handlePerPageChange = (newPerPage: string) => {
        setPerPage(parseInt(newPerPage));
        router.get(route('admin.verifikasi-pembayaran'), {
            search: search,
            status: status,
            per_page: newPerPage,
        });
    };

    const handleApprove = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menyetujui pembayaran ini?')) {
            router.post(
                route('admin.verifikasi-pembayaran.approve', id),
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleReject = (id: number, catatan: string) => {
        if (confirm('Apakah Anda yakin ingin menolak pembayaran ini?')) {
            router.post(
                route('admin.verifikasi-pembayaran.reject', id),
                {
                    catatan_verifikasi: catatan || 'Bukti transfer tidak valid',
                },
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'menunggu':
                return (
                    <Badge variant="outline" className="border-yellow-300 text-yellow-600">
                        <Clock className="mr-1 h-3 w-3" />
                        Menunggu
                    </Badge>
                );
            case 'disetujui':
                return (
                    <Badge variant="outline" className="border-green-300 text-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Disetujui
                    </Badge>
                );
            case 'ditolak':
                return (
                    <Badge variant="outline" className="border-red-300 text-red-600">
                        <XCircle className="mr-1 h-3 w-3" />
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatPeriode = (bulan: number, tahun: number) => {
        const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${namaBulan[bulan - 1]} ${tahun}`;
    };

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Verifikasi Pembayaran</h1>
                        <p className="text-gray-600">Kelola dan verifikasi bukti pembayaran dari pelanggan</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="rounded-lg bg-yellow-100 p-2">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_menunggu}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="rounded-lg bg-green-100 p-2">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Disetujui</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_disetujui}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="rounded-lg bg-red-100 p-2">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Ditolak</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_ditolak}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-1 gap-4">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Cari pelanggan..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-64 pl-9"
                                    />
                                </div>
                                <Button onClick={handleSearch} variant="outline">
                                    Cari
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="menunggu">Menunggu</SelectItem>
                                        <SelectItem value="disetujui">Disetujui</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Pelanggan</TableHead>
                                        <TableHead>Periode</TableHead>
                                        <TableHead>Metode</TableHead>
                                        <TableHead>Total Bayar</TableHead>
                                        <TableHead>Bukti Transfer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pembayaranList.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                                Tidak ada data pembayaran yang perlu diverifikasi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pembayaranList.data.map((pembayaran) => (
                                            <TableRow key={pembayaran.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{pembayaran.tagihan.pelanggan.nama}</p>
                                                        <p className="text-sm text-gray-500">{pembayaran.tagihan.pelanggan.nomor_meter}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    {formatPeriode(pembayaran.tagihan.bulan, pembayaran.tagihan.tahun)}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{pembayaran.metode_pembayaran.nama}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Admin: {formatCurrency(pembayaran.metode_pembayaran.biaya_admin)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-blue-600">
                                                    {formatCurrency(pembayaran.total_bayar)}
                                                </TableCell>
                                                <TableCell>
                                                    {pembayaran.bukti_transfer_url ? (
                                                        <img
                                                            src={pembayaran.bukti_transfer_url}
                                                            alt="Bukti Transfer"
                                                            className="h-16 w-16 cursor-pointer rounded object-cover transition-transform hover:scale-105"
                                                            onClick={() => window.open(pembayaran.bukti_transfer_url, '_blank')}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">Tidak ada</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(pembayaran.status_verifikasi)}</TableCell>
                                                <TableCell className="text-gray-600">
                                                    {new Date(pembayaran.tanggal_pembayaran).toLocaleDateString('id-ID')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => router.get(route('admin.verifikasi-pembayaran.show', pembayaran.id))}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>

                                                        {pembayaran.status_verifikasi === 'menunggu' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-green-600 hover:bg-green-50"
                                                                    onClick={() => handleApprove(pembayaran.id)}
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleReject(pembayaran.id, '')}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
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
                        <ResponsivePagination
                            data={pembayaranList}
                            routeName="admin.verifikasi-pembayaran"
                            routeParams={{ search, status, per_page: perPage }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
