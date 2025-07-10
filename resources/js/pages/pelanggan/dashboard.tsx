import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PelangganLayout from '@/layouts/pelanggan-layout';
import { Head } from '@inertiajs/react';
import { BarChart, CreditCard, PowerCircle, Receipt } from 'lucide-react';

export default function Dashboard() {
    return (
        <PelangganLayout>
            <Head title="Dashboard Pelanggan" />

            <div className="container mx-auto py-8">
                <h1 className="mb-6 text-3xl font-bold">Dashboard Pelanggan</h1>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tagihan Bulan Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp 250.000</div>
                            <p className="mt-1 text-xs text-muted-foreground">Jatuh tempo 20 Juli 2025</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button className="w-full" size="sm">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Bayar Sekarang
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Penggunaan Listrik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">125 kWh</div>
                            <p className="mt-1 text-xs text-muted-foreground">Periode 1 - 15 Juli 2025</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="outline" className="w-full" size="sm">
                                <BarChart className="mr-2 h-4 w-4" />
                                Lihat Penggunaan
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Daya Listrik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1300 VA</div>
                            <p className="mt-1 text-xs text-muted-foreground">Rp 1.444,70 per kWh</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="outline" className="w-full" size="sm">
                                <PowerCircle className="mr-2 h-4 w-4" />
                                Upgrade Daya
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <h2 className="mb-4 text-xl font-semibold">Riwayat Pembayaran</h2>
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 text-left">Tanggal</th>
                                    <th className="p-4 text-left">Deskripsi</th>
                                    <th className="p-4 text-left">Jumlah</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="p-4">10 Jun 2025</td>
                                    <td className="p-4">Tagihan Listrik Juni 2025</td>
                                    <td className="p-4">Rp 245.000</td>
                                    <td className="p-4">
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Lunas</span>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="ghost" size="sm">
                                            <Receipt className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-4">10 Mei 2025</td>
                                    <td className="p-4">Tagihan Listrik Mei 2025</td>
                                    <td className="p-4">Rp 230.000</td>
                                    <td className="p-4">
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Lunas</span>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="ghost" size="sm">
                                            <Receipt className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-4">10 Apr 2025</td>
                                    <td className="p-4">Tagihan Listrik April 2025</td>
                                    <td className="p-4">Rp 255.000</td>
                                    <td className="p-4">
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Lunas</span>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="ghost" size="sm">
                                            <Receipt className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                    <CardFooter className="justify-center p-4">
                        <Button variant="outline" size="sm">
                            Lihat Semua Riwayat
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </PelangganLayout>
    );
}
