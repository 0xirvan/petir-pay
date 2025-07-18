import { TagihanFormDialog } from '@/components/tagihan-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ResponsivePagination from '@/components/ui/responsive-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency, formatPeriode } from '@/utils/utils';
import { router, usePage } from '@inertiajs/react';
import { CalendarDays, CreditCard, Filter, Plus, Receipt, Search, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    alamat: string;
    tarif: Tarif;
}

interface Tagihan {
    id: number;
    bulan: number;
    tahun: number;
    jumlah_meter: number;
    jumlah_kwh: number;
    tarif_per_kwh: number;
    total_biaya: number;
    status: 'belum_bayar' | 'menunggu_konfirmasi' | 'lunas';
    created_at: string;
    pelanggan: Pelanggan;
}

interface KelolaTagihanProps {
    title: string;
    tagihan: {
        data: Tagihan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        status: string;
        per_page: number;
    };
    stats: {
        total_tagihan: number;
        total_belum_bayar: number;
        total_menunggu_konfirmasi: number;
        total_lunas: number;
    };
}

export default function KelolaTagihan({ title, tagihan, filters, stats }: KelolaTagihanProps) {
    const { props } = usePage<{ tagihanBaru?: Tagihan }>();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Update state when new tagihan is created
    useEffect(() => {
        if (props.tagihanBaru) {
            // Data will be updated through page refresh
            router.reload({ only: ['tagihan'] });
        }
    }, [props.tagihanBaru]);

    const handleSearch = (value: string) => {
        setSearch(value);
        const statusParam = status === 'all' ? '' : status;
        router.get(route('admin.tagihan'), { search: value, status: statusParam, per_page: perPage }, { preserveState: true, replace: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        const statusParam = value === 'all' ? '' : value;
        router.get(route('admin.tagihan'), { search, status: statusParam, per_page: perPage }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (value: string) => {
        setPerPage(parseInt(value));
        const statusParam = status === 'all' ? '' : status;
        router.get(route('admin.tagihan'), { search, status: statusParam, per_page: value }, { preserveState: true, replace: true });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            belum_bayar: { label: 'Belum Bayar', variant: 'destructive' as const, className: 'bg-red-500 hover:bg-red-600' },
            menunggu_konfirmasi: {
                label: 'Menunggu Konfirmasi',
                variant: 'secondary' as const,
                className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
            },
            lunas: { label: 'Lunas', variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const statsData = [
        { title: 'Total Tagihan', value: stats.total_tagihan, icon: Receipt, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Belum Bayar', value: stats.total_belum_bayar, icon: CreditCard, color: 'text-red-600', bgColor: 'bg-red-100' },
        {
            title: 'Menunggu Konfirmasi',
            value: stats.total_menunggu_konfirmasi,
            icon: CalendarDays,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        { title: 'Lunas', value: stats.total_lunas, icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
    ];

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Kelola Tagihan</h1>
                        <p className="text-gray-600">Kelola tagihan listrik pelanggan dan pantau status pembayaran</p>
                    </div>
                    <TagihanFormDialog
                        trigger={
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Tagihan Baru
                            </Button>
                        }
                    />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat) => (
                        <Card key={stat.title} className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cari Tagihan</label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan nama atau nomor meter..."
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                                        <SelectItem value="menunggu_konfirmasi">Menunggu Konfirmasi</SelectItem>
                                        <SelectItem value="lunas">Lunas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Per Halaman</label>
                                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tagihan Table */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold text-gray-900">Pelanggan</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Periode</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Pemakaian</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Tarif</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Total Biaya</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Status</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Dibuat</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tagihan.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-12 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <Receipt className="h-12 w-12 text-gray-400" />
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">Belum ada tagihan</h3>
                                                        <p className="text-gray-600">Buat tagihan pertama untuk memulai</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        tagihan.data.map((t) => (
                                            <TableRow key={t.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{t.pelanggan.nama}</p>
                                                        <p className="text-sm text-gray-600">No. Meter: {t.pelanggan.nomor_meter}</p>
                                                        <div className="mt-1 flex items-center gap-1">
                                                            <Zap className="h-3 w-3 text-yellow-600" />
                                                            <span className="text-xs text-gray-600">{t.pelanggan.tarif.daya} VA</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{formatPeriode(t.bulan, t.tahun)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <span className="font-semibold">{t.jumlah_meter} kWh</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm">{formatCurrency(t.tarif_per_kwh)}/kWh</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-bold text-blue-600">{formatCurrency(t.total_biaya)}</span>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(t.status)}</TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(t.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {tagihan.data.length > 0 && (
                            <ResponsivePagination
                                data={tagihan}
                                routeName="admin.tagihan"
                                routeParams={{ search, status: status === 'all' ? '' : status, per_page: perPage }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
