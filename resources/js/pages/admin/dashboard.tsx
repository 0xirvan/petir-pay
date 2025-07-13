import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/utils/utils';
import { Clock, TrendingUp, User, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface DashboardProps {
    title: string;
    statistik: {
        total_pelanggan: number;
        total_admin: number;
        total_tagihan_belum_bayar: number;
        total_tagihan_menunggu_konfirmasi: number;
        total_tagihan_lunas: number;
        total_pendapatan_bulan_ini: number;
        total_pendapatan_hari_ini: number;
    };
    recent_tagihan: Array<{
        id: number;
        nama_pelanggan: string;
        periode: string;
        total: number;
        status: string;
        jumlah_meter: number;
    }>;
    recent_pelanggan: Array<{
        id: number;
        nama: string;
        daya: number;
        tanggal_daftar: string;
        status: string;
    }>;
    pendapatan_bulanan: Array<{
        bulan: string;
        pendapatan: number;
        target: number;
    }>;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'menunggu_konfirmasi':
            return <span className="inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">Menunggu Konfirmasi</span>;
        case 'belum_bayar':
            return <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">Belum Bayar</span>;
        case 'lunas':
            return <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Lunas</span>;
        case 'aktif':
            return <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Aktif</span>;
        default:
            return <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">{status}</span>;
    }
};

export default function Dashboard({ title, statistik, recent_tagihan, recent_pelanggan, pendapatan_bulanan }: DashboardProps) {
    const statsData = {
        total_pelanggan: statistik.total_pelanggan,
        tagihan_pending: statistik.total_tagihan_menunggu_konfirmasi,
        pembayaran_hari_ini: statistik.total_pendapatan_hari_ini,
        total_admin: statistik.total_admin,
    };

    const statusTagihanData = [
        {
            name: 'Belum Bayar',
            value: statistik.total_tagihan_belum_bayar,
            count: statistik.total_tagihan_belum_bayar,
            color: '#ef4444',
        },
        {
            name: 'Menunggu Konfirmasi',
            value: statistik.total_tagihan_menunggu_konfirmasi,
            count: statistik.total_tagihan_menunggu_konfirmasi,
            color: '#f59e0b',
        },
        {
            name: 'Lunas',
            value: statistik.total_tagihan_lunas,
            count: statistik.total_tagihan_lunas,
            color: '#10b981',
        },
    ];

    const pendapatanData = pendapatan_bulanan || [];
    return (
        <AdminLayout title="Dashboard Admin">
            <div className="space-y-6">
                <div className="mb-4 sm:mb-6">
                    <h1 className="mb-1 text-xl font-bold text-gray-900 sm:mb-2 sm:text-2xl lg:text-3xl">Dashboard Admin</h1>
                    <p className="text-sm text-gray-600 sm:text-base">Selamat datang di panel administrasi ListrikPay</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Pelanggan</p>
                                    <p className="text-xl font-bold text-blue-600 sm:text-2xl">{statsData.total_pelanggan.toLocaleString()}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 sm:h-12 sm:w-12">
                                    <Users className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Tagihan Pending</p>
                                    <p className="text-xl font-bold text-orange-600 sm:text-2xl">{statsData.tagihan_pending}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 sm:h-12 sm:w-12">
                                    <Clock className="h-5 w-5 text-orange-600 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pembayaran Hari Ini</p>
                                    <p className="text-lg font-bold text-green-600 sm:text-2xl">{formatCurrency(statsData.pembayaran_hari_ini)}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
                                    <TrendingUp className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Admin</p>
                                    <p className="text-xl font-bold text-purple-600 sm:text-2xl">{statsData.total_admin}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 sm:h-12 sm:w-12">
                                    <User className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section - Responsive Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                    {/* Status Tagihan Chart */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg xl:text-xl">Status Tagihan</CardTitle>
                            <CardDescription className="text-sm">Distribusi status pembayaran tagihan</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ChartContainer
                                config={{
                                    belumBayar: {
                                        label: 'Belum Bayar',
                                        color: '#ef4444',
                                    },
                                    menungguKonfirmasi: {
                                        label: 'Menunggu Konfirmasi',
                                        color: '#f59e0b',
                                    },
                                    lunas: {
                                        label: 'Lunas',
                                        color: '#10b981',
                                    },
                                }}
                                className="h-[200px] w-full sm:h-[250px] md:h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusTagihanData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={window.innerWidth < 640 ? 30 : 40}
                                            outerRadius={window.innerWidth < 640 ? 60 : 80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusTagihanData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg sm:p-3">
                                                            <p className="text-sm font-medium sm:text-base">{data.name}</p>
                                                            <p className="text-xs text-gray-600 sm:text-sm">{data.count} tagihan</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            {/* Responsive Legend */}
                            <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-4">
                                {statusTagihanData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center space-x-2 rounded-lg bg-gray-50 p-2 sm:justify-start"
                                    >
                                        <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <div className="min-w-0 flex-1">
                                            <span className="block truncate text-xs text-gray-600 sm:text-sm">{item.name}</span>
                                            <span className="text-xs font-medium sm:text-sm">({item.count})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pendapatan Chart */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg xl:text-xl">Total Pendapatan</CardTitle>
                            <CardDescription className="text-sm">Pendapatan bulanan vs target</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ChartContainer
                                config={{
                                    pendapatan: {
                                        label: 'Pendapatan',
                                        color: '#3b82f6',
                                    },
                                    target: {
                                        label: 'Target',
                                        color: '#e5e7eb',
                                    },
                                }}
                                className="h-[250px] sm:h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pendapatanData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis
                                            dataKey="bulan"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#6b7280' }}
                                            className="text-xs"
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 10, fill: '#6b7280' }}
                                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                            className="text-xs"
                                        />
                                        <ChartTooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-2 shadow-lg sm:p-3">
                                                            <p className="mb-1 text-sm font-medium sm:mb-2">{label} 2024</p>
                                                            {payload.map((entry, index) => (
                                                                <div key={index} className="flex items-center justify-between space-x-2 sm:space-x-4">
                                                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                                                        <div
                                                                            className="h-2 w-2 rounded-full sm:h-3 sm:w-3"
                                                                            style={{ backgroundColor: entry.color }}
                                                                        ></div>
                                                                        <span className="text-xs sm:text-sm">{entry.name}:</span>
                                                                    </div>
                                                                    <span className="text-xs font-medium sm:text-sm">
                                                                        {formatCurrency(entry.value as number)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="target" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="pendapatan" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            {/* Responsive Summary */}
                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 sm:mt-4 sm:gap-4 sm:pt-4">
                                <div className="rounded-lg bg-blue-50 p-2 text-center sm:p-3">
                                    <p className="text-xs text-gray-600 sm:text-sm">Total Pendapatan</p>
                                    <p className="truncate text-sm font-bold text-blue-600 sm:text-lg">
                                        {formatCurrency(pendapatanData.reduce((sum, item) => sum + item.pendapatan, 0))}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-50 p-2 text-center sm:p-3">
                                    <p className="text-xs text-gray-600 sm:text-sm">Rata-rata Bulanan</p>
                                    <p className="truncate text-sm font-bold text-green-600 sm:text-lg">
                                        {formatCurrency(pendapatanData.reduce((sum, item) => sum + item.pendapatan, 0) / pendapatanData.length)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities - Responsive */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg xl:text-xl">Tagihan Menunggu Verifikasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                {recent_tagihan && recent_tagihan.length > 0 ? (
                                    recent_tagihan.slice(0, 3).map((tagihan) => (
                                        <div key={tagihan.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                            <div className="min-w-0 flex-1 pr-3">
                                                <p className="truncate text-sm font-medium sm:text-base">{tagihan.nama_pelanggan}</p>
                                                <p className="text-xs text-gray-600 sm:text-sm">{tagihan.periode}</p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-xs font-bold sm:text-sm xl:text-base">{formatCurrency(tagihan.total)}</p>
                                                <div className="mt-1">{getStatusBadge(tagihan.status)}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-gray-500">
                                        <p>Tidak ada tagihan yang menunggu verifikasi</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg xl:text-xl">Pelanggan Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 sm:space-y-4">
                                {recent_pelanggan && recent_pelanggan.length > 0 ? (
                                    recent_pelanggan.slice(0, 3).map((pelanggan) => (
                                        <div key={pelanggan.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                            <div className="min-w-0 flex-1 pr-3">
                                                <p className="truncate text-sm font-medium sm:text-base">{pelanggan.nama}</p>
                                                <p className="text-xs text-gray-600 sm:text-sm">{pelanggan.daya} VA</p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-xs text-gray-600 sm:text-sm">{pelanggan.tanggal_daftar}</p>
                                                <div className="mt-1">{getStatusBadge(pelanggan.status)}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-4 text-center text-gray-500">
                                        <p>Tidak ada pelanggan terbaru</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
