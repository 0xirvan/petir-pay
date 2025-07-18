import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/utils/utils';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, CheckCircle, Clock, CreditCard, FileText, User, X, XCircle } from 'lucide-react';
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
    alamat: string;
}

interface Tagihan {
    id: number;
    bulan: number;
    tahun: number;
    jumlah_meter: number;
    status: string;
    total_biaya: number;
    pelanggan: Pelanggan;
    tarif?: Tarif;
}

interface MetodePembayaran {
    id: number;
    nama: string;
    kode: string;
    atas_nama: string;
    nomor_rekening: string;
    biaya_admin: string;
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
    total_bayar: string;
    bukti_transfer: string;
    bukti_transfer_url: string;
    status_verifikasi: string;
    catatan_verifikasi: string;
    tanggal_verifikasi: string;
    verifikator?: Verifikator;
    created_at: string;
}

interface DetailVerifikasiPembayaranProps {
    title: string;
    pembayaran: Pembayaran;
}

export default function DetailVerifikasiPembayaran({ title, pembayaran }: DetailVerifikasiPembayaranProps) {
    const [catatan, setCatatan] = useState('');

    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui pembayaran ini?')) {
            router.post(route('admin.verifikasi-pembayaran.approve', pembayaran.id), {
                catatan_verifikasi: catatan,
            });
        }
    };

    const handleReject = () => {
        if (!catatan.trim()) {
            alert('Catatan penolakan harus diisi!');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menolak pembayaran ini?')) {
            router.post(route('admin.verifikasi-pembayaran.reject', pembayaran.id), {
                catatan_verifikasi: catatan,
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'menunggu':
                return (
                    <Badge variant="outline" className="border-yellow-300 text-yellow-600">
                        <Clock className="mr-1 h-4 w-4" />
                        Menunggu Verifikasi
                    </Badge>
                );
            case 'disetujui':
                return (
                    <Badge variant="outline" className="border-green-300 text-green-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Disetujui
                    </Badge>
                );
            case 'ditolak':
                return (
                    <Badge variant="outline" className="border-red-300 text-red-600">
                        <XCircle className="mr-1 h-4 w-4" />
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatPeriode = (bulan: number, tahun: number) => {
        const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${namaBulan[bulan - 1]} ${tahun}`;
    };

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.verifikasi-pembayaran')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detail Verifikasi Pembayaran</h1>
                        <p className="text-gray-600">Verifikasi bukti pembayaran dari pelanggan</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Bukti Transfer */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Bukti Transfer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pembayaran.bukti_transfer_url ? (
                                    <div className="space-y-4">
                                        <img
                                            src={pembayaran.bukti_transfer_url}
                                            alt="Bukti Transfer"
                                            className="w-full max-w-md cursor-pointer rounded-lg border shadow-sm transition-shadow hover:shadow-md"
                                            onClick={() => window.open(pembayaran.bukti_transfer_url, '_blank')}
                                        />
                                        <Button variant="outline" onClick={() => window.open(pembayaran.bukti_transfer_url, '_blank')}>
                                            Lihat Full Screen
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-gray-500">
                                        <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                        <p>Tidak ada bukti transfer yang diupload</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Data Pelanggan */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Data Pelanggan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Nama</Label>
                                        <p className="mt-1 text-gray-900">{pembayaran.tagihan.pelanggan.nama}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Nomor Meter</Label>
                                        <p className="mt-1 font-mono text-gray-900">{pembayaran.tagihan.pelanggan.nomor_meter}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                                        <p className="mt-1 text-gray-900">{pembayaran.tagihan.pelanggan.email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Alamat</Label>
                                        <p className="mt-1 text-gray-900">{pembayaran.tagihan.pelanggan.alamat}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verifikasi Actions */}
                        {pembayaran.status_verifikasi === 'menunggu' && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Verifikasi Pembayaran</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="catatan">Catatan (Opsional untuk setujui, Wajib untuk tolak)</Label>
                                        <Textarea
                                            id="catatan"
                                            placeholder="Masukkan catatan verifikasi..."
                                            value={catatan}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCatatan(e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                                            <Check className="mr-2 h-4 w-4" />
                                            Setujui Pembayaran
                                        </Button>
                                        <Button onClick={handleReject} variant="destructive">
                                            <X className="mr-2 h-4 w-4" />
                                            Tolak Pembayaran
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status Verifikasi */}
                        {pembayaran.status_verifikasi !== 'menunggu' && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Status Verifikasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <strong>Status:</strong>
                                        {getStatusBadge(pembayaran.status_verifikasi)}
                                    </div>
                                    {pembayaran.catatan_verifikasi && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Catatan</Label>
                                            <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-900">{pembayaran.catatan_verifikasi}</p>
                                        </div>
                                    )}
                                    {pembayaran.verifikator && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Diverifikasi oleh</Label>
                                            <p className="mt-1 text-gray-900">{pembayaran.verifikator.name}</p>
                                        </div>
                                    )}
                                    {pembayaran.tanggal_verifikasi && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Tanggal Verifikasi</Label>
                                            <p className="mt-1 text-gray-900">{new Date(pembayaran.tanggal_verifikasi).toLocaleString('id-ID')}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Info Pembayaran */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Info Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Periode Tagihan</Label>
                                    <p className="mt-1 text-lg font-semibold">{formatPeriode(pembayaran.tagihan.bulan, pembayaran.tagihan.tahun)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Penggunaan</Label>
                                    <p className="mt-1 font-semibold text-blue-600">{pembayaran.tagihan.jumlah_meter} kWh</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Biaya Listrik</Label>
                                    <p className="mt-1 text-gray-900">{formatCurrency(pembayaran.tagihan.total_biaya)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Biaya Admin</Label>
                                    <p className="mt-1 text-gray-900">{formatCurrency(pembayaran.metode_pembayaran.biaya_admin)}</p>
                                </div>
                                <hr />
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Total Pembayaran</Label>
                                    <p className="mt-1 text-2xl font-bold text-blue-600">
                                        {formatCurrency(parseFloat(pembayaran.total_bayar) + parseFloat(pembayaran.metode_pembayaran.biaya_admin))}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metode Pembayaran */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Metode Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Bank/Platform</Label>
                                    <p className="mt-1 font-semibold">{pembayaran.metode_pembayaran.nama}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Atas Nama</Label>
                                    <p className="mt-1 text-gray-900">{pembayaran.metode_pembayaran.atas_nama}</p>
                                </div>
                                {pembayaran.metode_pembayaran.nomor_rekening && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">No. Rekening</Label>
                                        <p className="mt-1 font-mono text-gray-900">{pembayaran.metode_pembayaran.nomor_rekening}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                                    <div>
                                        <p className="font-medium">Pembayaran Dibuat</p>
                                        <p className="text-sm text-gray-500">{new Date(pembayaran.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Tanggal Pembayaran</p>
                                        <p className="text-sm text-gray-500">{new Date(pembayaran.tanggal_pembayaran).toLocaleDateString('id-ID')}</p>
                                    </div>
                                    {pembayaran.tanggal_verifikasi && (
                                        <div>
                                            <p className="font-medium">Diverifikasi</p>
                                            <p className="text-sm text-gray-500">{new Date(pembayaran.tanggal_verifikasi).toLocaleString('id-ID')}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
