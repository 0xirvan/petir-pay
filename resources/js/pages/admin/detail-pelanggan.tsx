import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, CreditCard, MapPin, User, Zap } from 'lucide-react';

interface Tarif {
    id: number;
    daya: number;
    tarif_per_kwh: number;
    deskripsi?: string;
    jenis?: string;
}

interface Penggunaan {
    id: number;
    bulan: string;
    tahun: number;
    meter_awal: number;
    meter_akhir: number;
    jumlah_kwh: number;
    created_at: string;
}

interface Pembayaran {
    id: number;
    tanggal_pembayaran: string;
    total_bayar: number | string;
    metode_pembayaran: {
        id: number;
        nama: string;
        biaya_admin: number | string;
    };
}

interface Tagihan {
    id: number;
    bulan: string;
    tahun: number;
    jumlah_meter: number;
    jumlah_kwh: number;
    tarif_per_kwh: number;
    total_biaya: number;
    status: string;
    tanggal_bayar?: string;
    created_at: string;
    pembayaran?: Pembayaran[];
}

interface Pelanggan {
    id: number;
    nama: string;
    email: string;
    nomor_meter: string;
    alamat: string;
    created_at: string;
    tarif: Tarif;
    penggunaan: Penggunaan[];
    tagihan: Tagihan[];
}

interface DetailPelangganProps {
    title: string;
    pelanggan: Pelanggan;
}

export default function DetailPelanggan({ title, pelanggan }: DetailPelangganProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'lunas':
                return <Badge className="bg-green-100 text-green-800">Lunas</Badge>;
            case 'belum_bayar':
                return <Badge className="bg-red-100 text-red-800">Belum Bayar</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        // Pastikan amount adalah number yang valid
        const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(validAmount);
    };

    const totalTagihanBelumBayar = pelanggan.tagihan
        .filter((t) => t.status === 'belum_bayar')
        .reduce((sum, t) => {
            // Untuk tagihan belum bayar, kita hanya hitung biaya listrik tanpa biaya admin
            // karena biaya admin baru ditentukan saat memilih metode pembayaran
            return sum + t.total_biaya;
        }, 0);

    const totalPenggunaanBulanIni = pelanggan.penggunaan.length > 0 ? pelanggan.penggunaan[0].jumlah_kwh : 0;

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.data-pelanggan')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detail Pelanggan</h1>
                        <p className="text-gray-600">Informasi lengkap pelanggan {pelanggan.nama}</p>
                    </div>
                </div>

                {/* Informasi Pelanggan */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Info Dasar */}
                    <Card className="border-0 shadow-lg lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Pelanggan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">{pelanggan.nama}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 text-lg text-gray-900">{pelanggan.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nomor Meter</label>
                                    <p className="mt-1 font-mono text-lg font-semibold text-gray-900">{pelanggan.nomor_meter}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Tanggal Daftar</label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        {new Date(pelanggan.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Alamat</label>
                                <p className="mt-1 flex items-start gap-2 text-lg text-gray-900">
                                    <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                    {pelanggan.alamat}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Tarif */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Informasi Tarif
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Daya</label>
                                <p className="mt-1 text-lg font-semibold text-blue-600">{pelanggan.tarif.daya} VA</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Harga per kWh</label>
                                <p className="mt-1 text-lg font-semibold text-green-600">{formatCurrency(pelanggan.tarif.tarif_per_kwh)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Deskripsi</label>
                                <p className="mt-1 text-sm text-gray-600">{pelanggan.tarif.deskripsi || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistik */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Penggunaan Bulan Ini</p>
                                    <p className="text-2xl font-bold text-blue-600">{totalPenggunaanBulanIni} kWh</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    <Zap className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Tagihan Belum Bayar</p>
                                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalTagihanBelumBayar)}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                                    <CreditCard className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Tagihan</p>
                                    <p className="text-2xl font-bold text-green-600">{pelanggan.tagihan.length}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {formatCurrency(
                                            pelanggan.tagihan
                                                .filter((t) => t.status === 'lunas')
                                                .reduce((sum, t) => {
                                                    const pembayaran = t.pembayaran?.[0];
                                                    const totalBayar = pembayaran?.total_bayar;
                                                    // Pastikan nilai numerik yang valid
                                                    const validAmount =
                                                        typeof totalBayar === 'number' && !isNaN(totalBayar) ? totalBayar : t.total_biaya;
                                                    return sum + validAmount;
                                                }, 0),
                                        )}
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                    <CreditCard className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Riwayat Penggunaan */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Riwayat Penggunaan Listrik (12 Bulan Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-200 bg-gray-50">
                                        <TableHead className="font-semibold text-gray-700">Periode</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Meter Awal</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Meter Akhir</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Penggunaan (kWh)</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Tanggal Input</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pelanggan.penggunaan.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                                                Belum ada data penggunaan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pelanggan.penggunaan.map((penggunaan) => (
                                            <TableRow key={penggunaan.id} className="border-gray-100">
                                                <TableCell className="font-medium">
                                                    {penggunaan.bulan} {penggunaan.tahun}
                                                </TableCell>
                                                <TableCell className="font-mono">{penggunaan.meter_awal}</TableCell>
                                                <TableCell className="font-mono">{penggunaan.meter_akhir}</TableCell>
                                                <TableCell className="font-semibold text-blue-600">{penggunaan.jumlah_kwh} kWh</TableCell>
                                                <TableCell className="text-gray-600">
                                                    {new Date(penggunaan.created_at).toLocaleDateString('id-ID')}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Riwayat Tagihan */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Riwayat Tagihan (12 Bulan Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-200 bg-gray-50">
                                        <TableHead className="font-semibold text-gray-700">Periode</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Penggunaan</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Tarif/kWh</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Biaya Listrik</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Biaya Admin</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Total Bayar</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Tanggal Bayar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pelanggan.tagihan.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                                Belum ada data tagihan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pelanggan.tagihan.map((tagihan) => {
                                            const pembayaran = tagihan.pembayaran?.[0]; // Ambil pembayaran pertama (jika ada)
                                            const biayaAdminRaw = pembayaran?.metode_pembayaran?.biaya_admin;
                                            const totalBayarRaw = pembayaran?.total_bayar;

                                            // Convert string values to numbers - handle both string and number types
                                            const biayaAdmin =
                                                typeof biayaAdminRaw === 'string'
                                                    ? parseFloat(biayaAdminRaw)
                                                    : typeof biayaAdminRaw === 'number'
                                                      ? biayaAdminRaw
                                                      : 0;
                                            const totalBayar =
                                                typeof totalBayarRaw === 'string'
                                                    ? parseFloat(totalBayarRaw)
                                                    : typeof totalBayarRaw === 'number'
                                                      ? totalBayarRaw
                                                      : 0;

                                            return (
                                                <TableRow key={tagihan.id} className="border-gray-100">
                                                    <TableCell className="font-medium">
                                                        {tagihan.bulan} {tagihan.tahun}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-blue-600">{tagihan.jumlah_kwh} kWh</TableCell>
                                                    <TableCell className="font-mono">{formatCurrency(tagihan.tarif_per_kwh)}</TableCell>
                                                    <TableCell className="font-semibold text-green-600">
                                                        {formatCurrency(tagihan.total_biaya)}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-orange-600">
                                                        {tagihan.status === 'lunas' &&
                                                        pembayaran &&
                                                        pembayaran.metode_pembayaran &&
                                                        !isNaN(biayaAdmin)
                                                            ? formatCurrency(biayaAdmin)
                                                            : tagihan.status === 'belum_bayar'
                                                              ? 'Belum ditentukan'
                                                              : '-'}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-blue-600">
                                                        {tagihan.status === 'lunas' && pembayaran && !isNaN(totalBayar)
                                                            ? formatCurrency(totalBayar)
                                                            : tagihan.status === 'belum_bayar'
                                                              ? `${formatCurrency(tagihan.total_biaya)} + admin`
                                                              : formatCurrency(tagihan.total_biaya)}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(tagihan.status)}</TableCell>
                                                    <TableCell className="text-gray-600">
                                                        {tagihan.tanggal_bayar ? new Date(tagihan.tanggal_bayar).toLocaleDateString('id-ID') : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
