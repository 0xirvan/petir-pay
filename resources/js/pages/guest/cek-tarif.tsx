import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/utils/utils';
import { Calculator, Info, Receipt, Search } from 'lucide-react';
import { useState } from 'react';
import { scroller } from 'react-scroll';

interface Tarif {
    id: number;
    daya: string;
    tarif_per_kwh: number;
    deskripsi: string;
}

interface CekTarifProps {
    tarifList: Tarif[];
}

export default function CekTarif({ tarifList }: CekTarifProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDaya, setSelectedDaya] = useState('');
    const [pemakaianKwh, setPemakaianKwh] = useState('');
    const [hasilHitung, setHasilHitung] = useState<any>(null);

    const filteredTarif = tarifList.filter((tarif) => {
        const matchesSearch =
            String(tarif.daya).toLowerCase().includes(searchTerm.toLowerCase()) || tarif.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const selectTarif = (daya: string) => {
        setSelectedDaya(daya);

        scroller.scrollTo('kalkulator', {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart',
        });
    };

    const hitungTagihan = () => {
        if (!selectedDaya || !pemakaianKwh) {
            alert('Silakan pilih daya dan masukkan pemakaian kWh');
            return;
        }

        const tarif = tarifList.find((t) => t.daya === selectedDaya);
        if (!tarif) return;

        const kwh = Number.parseFloat(pemakaianKwh);
        const total = kwh * tarif.tarif_per_kwh;

        setHasilHitung({
            tarif,
            kwh,
            total,
        });
    };

    return (
        <AppLayout title="Tarif Listrik">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        Tarif Listrik & <span className="text-blue-600">Kalkulator Biaya</span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-xl text-gray-600">
                        Cek tarif listrik terbaru 2024 dan hitung estimasi tagihan bulanan Anda dengan mudah dan akurat.
                    </p>
                </div>

                {/* Search  */}
                <Card className="mb-8 border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Cari berdasarkan daya atau deskripsi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Tariff Cards - 2/3 width */}
                    <div className="lg:col-span-2">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Daftar Tarif Listrik</h2>
                        <div className="mb-8 grid gap-6 md:grid-cols-2">
                            {filteredTarif.map((tarif) => (
                                <Card key={tarif.id} className="border-0 shadow-lg transition-shadow hover:shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="space-y-4 text-center">
                                            <div className="text-4xl font-bold text-blue-600">{tarif.daya} VA</div>
                                            <div className="text-gray-600">{tarif.deskripsi}</div>
                                            <div className="py-3">
                                                <div className="text-2xl font-bold text-green-600">{formatCurrency(tarif.tarif_per_kwh)}</div>
                                                <div className="text-sm text-gray-500">per kWh</div>
                                            </div>
                                            <Button onClick={() => selectTarif(tarif.daya)} className="w-full bg-blue-600 hover:bg-blue-700">
                                                <Calculator className="mr-2 h-4 w-4" />
                                                Hitung Biaya
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Calculator Section - 1/3 width */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Calculator Form */}
                            <Card id="kalkulator" className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-xl">
                                        <Calculator className="mr-2 h-5 w-5" />
                                        Kalkulator Biaya
                                    </CardTitle>
                                    <CardDescription>Hitung estimasi tagihan listrik bulanan</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="daya">Daya Terpasang</Label>
                                        <Select value={selectedDaya} onValueChange={setSelectedDaya}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih daya terpasang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tarifList.map((tarif) => (
                                                    <SelectItem key={tarif.daya} value={tarif.daya}>
                                                        {tarif.daya} VA
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kwh">Pemakaian (kWh)</Label>
                                        <Input
                                            id="kwh"
                                            type="number"
                                            placeholder="Masukkan pemakaian dalam kWh"
                                            value={pemakaianKwh}
                                            onChange={(e) => setPemakaianKwh(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500">Lihat pemakaian kWh di meteran listrik atau tagihan bulan lalu</p>
                                    </div>

                                    <Button onClick={hitungTagihan} className="w-full bg-blue-600 hover:bg-blue-700">
                                        <Calculator className="mr-2 h-4 w-4" />
                                        Hitung Tagihan
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* results */}
                            {hasilHitung ? (
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl">Hasil Perhitungan</CardTitle>
                                        </div>
                                        <CardDescription>Estimasi biaya untuk daya {hasilHitung.tarif.daya} VA</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Pemakaian</span>
                                                <span className="font-semibold">{hasilHitung.kwh.toFixed(2)} kWh</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tarif per kWh</span>
                                                <span className="font-semibold">{formatCurrency(hasilHitung.tarif.tarif_per_kwh)}</span>
                                            </div>
                                            <div className="border-t pt-3">
                                                <div className="flex justify-between text-xl font-bold">
                                                    <span>Total Biaya</span>
                                                    <span className="text-blue-600">{formatCurrency(hasilHitung.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-8 text-center">
                                        <Receipt className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">Belum Ada Perhitungan</h3>
                                        <p className="text-sm text-gray-600">
                                            Pilih tarif di sebelah kiri atau isi form kalkulator untuk menghitung biaya listrik.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tips Card */}
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Info className="h-5 w-5 text-blue-600" />
                                        <CardTitle className="text-lg">Tips Hemat Listrik</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>• Gunakan lampu LED yang lebih hemat energi</li>
                                        <li>• Matikan perangkat elektronik saat tidak digunakan</li>
                                        <li>• Atur suhu AC pada 24-26°C untuk efisiensi optimal</li>
                                        <li>• Pilih perangkat dengan label Energy Star</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Information Section */}
                <Card className="mt-12 border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Info className="h-6 w-6 text-blue-600" />
                            <CardTitle className="text-xl">Informasi Tarif Listrik</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h4 className="mb-2 font-semibold text-gray-900">Cara Menghitung</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>
                                        • <strong>Pemakaian kWh:</strong> Lihat di meteran listrik atau tagihan
                                    </li>
                                    <li>
                                        • <strong>Tarif per kWh:</strong> Sesuai daya terpasang rumah Anda
                                    </li>
                                    <li>
                                        • <strong>Total Biaya:</strong> Pemakaian × Tarif per kWh
                                    </li>
                                    <li>
                                        • <strong>Estimasi:</strong> Hasil perhitungan adalah perkiraan
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-2 font-semibold text-gray-900">Golongan Tarif</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>
                                        • <strong>R-1/TR:</strong> Rumah tangga tegangan rendah
                                    </li>
                                    <li>
                                        • <strong>B-1/TR:</strong> Bisnis tegangan rendah
                                    </li>
                                    <li>
                                        • <strong>I-1/TR:</strong> Industri tegangan rendah
                                    </li>
                                    <li>
                                        • <strong>VA:</strong> Volt Ampere (daya terpasang)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-start space-x-2">
                                <Info className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Catatan</p>
                                    <p className="mt-1 text-xs text-blue-700">
                                        Tarif ini adalah estimasi berdasarkan tarif dasar PLN. Tagihan sebenarnya mungkin berbeda karena ada komponen
                                        lain seperti biaya administrasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
