import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, router } from '@inertiajs/react';
import { Bell, CheckCircle, Eye, LogOut, Receipt, Settings, TrendingUp, User, Wallet, X, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface CustomerData {
    nama: string;
    id_pelanggan: string;
    alamat: string;
    daya: string;
    tarif: string;
}

interface TagihanData {
    id: string;
    periode: string;
    pemakaian: number;
    tarif_per_kwh: number;
    total: number;
    status: 'belum_bayar' | 'lunas' | 'menunggu_konfirmasi' | 'terlambat';
    tanggal_bayar?: string;
    metode_pembayaran?: string;
}

interface RiwayatPembayaran {
    id: string;
    tanggal: string;
    periode: string;
    jumlah: number;
    metode: string;
    status: 'berhasil' | 'gagal' | 'pending' | 'menunggu_verifikasi';
    no_referensi: string;
}

interface MetodePembayaran {
    id: number;
    nama: string;
    kode: string;
    atas_nama: string;
    nomor_rekening: string;
    biaya_admin: number;
    deskripsi: string;
    logo: string | null;
    logo_url: string | null;
    is_aktif: boolean;
}

interface Props {
    pelanggan: CustomerData;
    currentBill: TagihanData | null;
    riwayatTagihan: TagihanData[];
    riwayatPembayaran: RiwayatPembayaran[];
    metodePembayaran: MetodePembayaran[];
    statusDashboard: 'belum_bayar' | 'lunas';
}

export default function Dashboard({ pelanggan, currentBill, riwayatTagihan, riwayatPembayaran, metodePembayaran, statusDashboard }: Props) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<MetodePembayaran | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [uploadedProof, setUploadedProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                alert('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
                return;
            }

            if (file.size > maxSize) {
                alert('Ukuran file terlalu besar. Maksimal 5MB.');
                return;
            }

            setUploadedProof(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleManualPayment = async () => {
        if (!uploadedProof || !currentBill) {
            alert('Silakan upload bukti pembayaran terlebih dahulu');
            return;
        }

        setIsProcessingPayment(true);

        const formData = new FormData();
        formData.append('tagihan_id', currentBill.id);
        formData.append('bukti_transfer', uploadedProof);

        router.post('/pelanggan/upload-bukti-pembayaran', formData, {
            onSuccess: () => {
                setUploadedProof(null);
                setPreviewUrl(null);
                setSelectedPaymentMethod(null);
                setIsProcessingPayment(false);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                setIsProcessingPayment(false);
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'belum_bayar':
                return <Badge variant="destructive">Belum Bayar</Badge>;
            case 'lunas':
                return <Badge className="bg-green-100 text-green-800">Lunas</Badge>;
            case 'menunggu_konfirmasi':
                return <Badge className="bg-blue-100 text-blue-800">Menunggu Konfirmasi</Badge>;
            case 'terlambat':
                return <Badge className="bg-orange-100 text-orange-800">Terlambat</Badge>;
            case 'menunggu_verifikasi':
                return <Badge className="bg-blue-100 text-blue-800">Menunggu Verifikasi</Badge>;
            case 'berhasil':
                return <Badge className="bg-green-100 text-green-800">Berhasil</Badge>;
            case 'gagal':
                return <Badge variant="destructive">Gagal</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleLogout = () => {
        router.post('/pelanggan/logout');
    };

    return (
        <>
            <Head title="Dashboard Pelanggan" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                                        <Zap className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
                                </div>
                                <div>
                                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent">
                                        PetirPay
                                    </span>
                                    <div className="-mt-1 text-xs text-gray-500">Dashboard Pelanggan</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                                </Button>
                                <div className="flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{pelanggan.nama}</p>
                                        <p className="text-xs text-gray-500">ID: {pelanggan.id_pelanggan}</p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Settings className="h-5 w-5 text-gray-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleLogout}>
                                    <LogOut className="h-5 w-5 text-gray-600" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Selamat datang, {pelanggan.nama}!</h1>
                        <p className="text-gray-600">Kelola tagihan listrik Anda dengan mudah dan aman</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Tagihan Bulan Ini</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {currentBill ? formatCurrency(currentBill.total) : statusDashboard === 'lunas' ? 'Lunas' : 'Tidak Ada'}
                                        </p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                                        <Receipt className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Pemakaian</p>
                                        <p className="text-2xl font-bold text-blue-600">{currentBill ? `${currentBill.pemakaian} kWh` : '0 kWh'}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                        <TrendingUp className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Daya Terpasang</p>
                                        <p className="text-2xl font-bold text-green-600">{pelanggan.daya}</p>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                        <Zap className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 border border-gray-200 bg-white shadow-sm">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="bayar" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                Bayar Tagihan
                            </TabsTrigger>
                            <TabsTrigger value="riwayat" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                Riwayat
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Current Bill Card */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl">Tagihan Terbaru</CardTitle>
                                            {currentBill && getStatusBadge(currentBill.status)}
                                        </div>
                                        <CardDescription>
                                            {currentBill ? `Periode ${currentBill.periode}` : 'Tidak ada tagihan aktif'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {currentBill ? (
                                            <>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Pemakaian</span>
                                                        <span className="font-semibold">{currentBill.pemakaian} kWh</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Tarif per kWh</span>
                                                        <span className="font-semibold">{formatCurrency(currentBill.tarif_per_kwh)}</span>
                                                    </div>
                                                    <div className="border-t pt-3">
                                                        <div className="flex justify-between text-lg font-bold">
                                                            <span>Total Tagihan</span>
                                                            <span className="text-blue-600">{formatCurrency(currentBill.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-4">
                                                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab('bayar')}>
                                                        Bayar Sekarang
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <p className="text-gray-500">Tidak ada tagihan yang perlu dibayar</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Customer Info Card */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Informasi Pelanggan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-gray-600">Nama Pelanggan</Label>
                                                <p className="font-semibold">{pelanggan.nama}</p>
                                            </div>
                                            <div>
                                                <Label className="text-gray-600">ID Pelanggan</Label>
                                                <p className="font-semibold">{pelanggan.id_pelanggan}</p>
                                            </div>
                                            <div>
                                                <Label className="text-gray-600">Alamat</Label>
                                                <p className="font-semibold">{pelanggan.alamat}</p>
                                            </div>
                                            <div>
                                                <Label className="text-gray-600">Daya Terpasang</Label>
                                                <p className="font-semibold">{pelanggan.daya}</p>
                                            </div>
                                            <div>
                                                <Label className="text-gray-600">Golongan Tarif</Label>
                                                <p className="font-semibold">{pelanggan.tarif}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Bayar Tagihan Tab */}
                        <TabsContent value="bayar" className="space-y-6">
                            {currentBill ? (
                                <div className="grid gap-6 lg:grid-cols-2">
                                    {/* Payment Form */}
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Pembayaran Manual</CardTitle>
                                            <CardDescription>Pilih metode pembayaran dan upload bukti transfer</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="payment-method" className="font-medium text-gray-700">
                                                        Metode Pembayaran
                                                    </Label>
                                                    <div className="mt-2 grid gap-3">
                                                        {metodePembayaran.map((metode) => (
                                                            <div
                                                                key={metode.id}
                                                                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                                                    selectedPaymentMethod?.id === metode.id
                                                                        ? 'border-blue-500 bg-blue-50'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                onClick={() => setSelectedPaymentMethod(metode)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                                                            <Wallet className="h-4 w-4 text-gray-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">{metode.nama}</p>
                                                                            <p className="text-sm text-gray-500">{metode.deskripsi}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-medium">
                                                                            Biaya admin: {formatCurrency(metode.biaya_admin)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {selectedPaymentMethod && (
                                                    <div className="space-y-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                                                        <div className="text-center">
                                                            <h4 className="mb-2 font-semibold text-indigo-900">
                                                                Informasi Transfer {selectedPaymentMethod.nama}
                                                            </h4>
                                                            <div className="rounded-lg border border-indigo-200 bg-white p-4 text-left">
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">Bank:</span>
                                                                        <span className="font-semibold">{selectedPaymentMethod.nama}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">No. Rekening:</span>
                                                                        <span className="font-semibold">{selectedPaymentMethod.nomor_rekening}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-600">Atas Nama:</span>
                                                                        <span className="font-semibold">{selectedPaymentMethod.atas_nama}</span>
                                                                    </div>
                                                                    <div className="flex justify-between border-t pt-2">
                                                                        <span className="text-gray-600">Jumlah Transfer:</span>
                                                                        <span className="font-bold text-indigo-600">
                                                                            {formatCurrency(currentBill.total + selectedPaymentMethod.biaya_admin)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <Label htmlFor="payment-proof" className="font-medium text-gray-700">
                                                                Upload Bukti Pembayaran
                                                            </Label>
                                                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-indigo-400">
                                                                <input
                                                                    id="payment-proof"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleFileUpload}
                                                                    className="hidden"
                                                                />
                                                                <label
                                                                    htmlFor="payment-proof"
                                                                    className="flex cursor-pointer flex-col items-center space-y-2"
                                                                >
                                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                                                        <svg
                                                                            className="h-6 w-6 text-indigo-600"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">Klik untuk upload foto</p>
                                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                                                                    </div>
                                                                </label>
                                                            </div>

                                                            {previewUrl && (
                                                                <div className="mt-4">
                                                                    <Label className="mb-2 block font-medium text-gray-700">
                                                                        Preview Bukti Pembayaran:
                                                                    </Label>
                                                                    <div className="relative">
                                                                        <img
                                                                            src={previewUrl}
                                                                            alt="Preview bukti pembayaran"
                                                                            className="mx-auto w-full max-w-sm rounded-lg border border-gray-200 shadow-sm"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setUploadedProof(null);
                                                                                setPreviewUrl(null);
                                                                            }}
                                                                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                    <p className="mt-2 text-center text-xs text-gray-500">
                                                                        File: {uploadedProof?.name} (
                                                                        {((uploadedProof?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                                            <div className="flex items-start space-x-2">
                                                                <svg
                                                                    className="mt-0.5 h-5 w-5 text-yellow-600"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                                    />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-sm font-medium text-yellow-800">Penting!</p>
                                                                    <ul className="mt-1 space-y-1 text-xs text-yellow-700">
                                                                        <li>• Pastikan foto bukti transfer jelas dan dapat dibaca</li>
                                                                        <li>• Jumlah transfer harus sesuai dengan total tagihan</li>
                                                                        <li>• Verifikasi pembayaran membutuhkan waktu 1x24 jam</li>
                                                                        <li>• Anda akan mendapat notifikasi setelah pembayaran diverifikasi</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                onClick={handleManualPayment}
                                                disabled={!uploadedProof || !selectedPaymentMethod || isProcessingPayment}
                                                className="h-12 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl"
                                            >
                                                {isProcessingPayment ? 'Mengupload Bukti...' : 'Upload Bukti Pembayaran'}
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Bill Summary */}
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Ringkasan Tagihan</CardTitle>
                                            <CardDescription>Periode {currentBill.periode}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Biaya Pemakaian ({currentBill.pemakaian} kWh)</span>
                                                    <span className="font-semibold">{formatCurrency(currentBill.total)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Biaya Admin</span>
                                                    <span className="font-semibold">
                                                        {selectedPaymentMethod ? formatCurrency(selectedPaymentMethod.biaya_admin) : 'Rp 0'}
                                                    </span>
                                                </div>
                                                <div className="border-t pt-3">
                                                    <div className="flex justify-between text-lg font-bold">
                                                        <span>Total Pembayaran</span>
                                                        <span className="text-blue-600">
                                                            {formatCurrency(
                                                                currentBill.total + (selectedPaymentMethod ? selectedPaymentMethod.biaya_admin : 0),
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4">
                                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Pembayaran aman dan terenkripsi</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-8 text-center">
                                        <p className="text-lg text-gray-500">Tidak ada tagihan yang perlu dibayar</p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {/* Riwayat Tab */}
                        <TabsContent value="riwayat" className="space-y-6">
                            {/* Riwayat Tagihan */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl">Riwayat Tagihan</CardTitle>
                                    <CardDescription>Daftar tagihan listrik Anda</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {riwayatTagihan.length > 0 ? (
                                            riwayatTagihan.map((tagihan) => (
                                                <div
                                                    key={tagihan.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                                            <Receipt className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{tagihan.periode}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                Pemakaian: {tagihan.pemakaian} kWh
                                                                {tagihan.tanggal_bayar && ` • Dibayar: ${formatDate(tagihan.tanggal_bayar)}`}
                                                            </p>
                                                            {tagihan.metode_pembayaran && (
                                                                <p className="text-xs text-gray-500">via {tagihan.metode_pembayaran}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">{formatCurrency(tagihan.total)}</p>
                                                        <div className="mt-1 flex items-center space-x-2">
                                                            {getStatusBadge(tagihan.status)}
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <p className="text-gray-500">Belum ada riwayat tagihan</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Riwayat Pembayaran */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl">Riwayat Pembayaran</CardTitle>
                                    <CardDescription>Transaksi pembayaran yang telah dilakukan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {riwayatPembayaran.length > 0 ? (
                                            riwayatPembayaran.map((pembayaran) => (
                                                <div
                                                    key={pembayaran.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{pembayaran.periode}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {formatDate(pembayaran.tanggal)} • via {pembayaran.metode}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Ref: {pembayaran.no_referensi}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">{formatCurrency(pembayaran.jumlah)}</p>
                                                        <div className="mt-1 flex items-center space-x-2">{getStatusBadge(pembayaran.status)}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center">
                                                <p className="text-gray-500">Belum ada riwayat pembayaran</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
