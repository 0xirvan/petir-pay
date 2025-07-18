import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/utils';
import { router } from '@inertiajs/react';
import { CalendarDays, Search, User, Zap } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface Pelanggan {
    id: number;
    nama: string;
    nomor_meter: string;
    email: string;
    alamat: string;
    tarif: {
        id: number;
        daya: number;
        tarif_per_kwh: number;
        deskripsi: string;
    } | null;
}

interface TagihanFormDialogProps {
    trigger: ReactNode;
}

export function TagihanFormDialog({ trigger }: TagihanFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
    const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(null);
    const [bulan, setBulan] = useState('');
    const [tahun, setTahun] = useState(new Date().getFullYear().toString());
    const [jumlahMeter, setJumlahMeter] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [meterAwalInfo, setMeterAwalInfo] = useState<{
        meter_akhir: number;
        previous_month: number;
        previous_year: number;
        has_previous: boolean;
    } | null>(null);

    // Search pelanggan
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm.length >= 2) {
                searchPelanggan(searchTerm);
            } else {
                setPelangganList([]);
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const searchPelanggan = async (search: string) => {
        setSearchLoading(true);
        try {
            const response = await fetch(`/admin/tagihan/search-pelanggan?search=${encodeURIComponent(search)}`);
            const data = await response.json();
            setPelangganList(data);
        } catch (error) {
            console.error('Error searching pelanggan:', error);
            setPelangganList([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPelanggan || !bulan || !tahun || !jumlahMeter) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('admin.tagihan.store'),
            {
                id_pelanggan: selectedPelanggan.id,
                bulan: parseInt(bulan),
                tahun: parseInt(tahun),
                jumlah_meter: parseInt(jumlahMeter),
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    resetForm();
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const resetForm = () => {
        setSearchTerm('');
        setPelangganList([]);
        setSelectedPelanggan(null);
        setBulan('');
        setTahun(new Date().getFullYear().toString());
        setJumlahMeter('');
        setMeterAwalInfo(null);
    };

    const calculateEstimatedBill = () => {
        if (!selectedPelanggan?.tarif || !jumlahMeter) return 0;
        return parseInt(jumlahMeter) * selectedPelanggan.tarif.tarif_per_kwh;
    };

    const getBulanName = (month: number) => {
        const bulanNames = [
            '',
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];
        return bulanNames[month] || '';
    };

    const bulanOptions = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    const currentYear = new Date().getFullYear();
    const tahunOptions = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);

    // Get meter awal info when pelanggan, bulan, or tahun changes
    useEffect(() => {
        if (selectedPelanggan && bulan && tahun) {
            getMeterAwalInfo();
        } else {
            setMeterAwalInfo(null);
        }
    }, [selectedPelanggan, bulan, tahun]);

    const getMeterAwalInfo = async () => {
        if (!selectedPelanggan || !bulan || !tahun) return;

        try {
            const response = await fetch(
                `/admin/tagihan/penggunaan-bulan-sebelumnya?id_pelanggan=${selectedPelanggan.id}&bulan=${bulan}&tahun=${tahun}`,
            );
            const data = await response.json();
            setMeterAwalInfo(data);
        } catch (error) {
            console.error('Error fetching meter awal info:', error);
            setMeterAwalInfo(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                        Buat Tagihan Baru
                    </DialogTitle>
                    <DialogDescription>
                        Buat tagihan listrik baru untuk pelanggan dengan mencari dan memilih pelanggan terlebih dahulu.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Search Pelanggan */}
                    <div className="space-y-3">
                        <Label htmlFor="search-pelanggan">Cari Pelanggan</Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="search-pelanggan"
                                placeholder="Cari berdasarkan nama, nomor meter, atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={!!selectedPelanggan}
                            />
                            {searchLoading && (
                                <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-blue-600 border-b-transparent"></div>
                            )}
                        </div>

                        {/* Search Results */}
                        {pelangganList.length > 0 && !selectedPelanggan && (
                            <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border bg-white p-2">
                                {pelangganList.map((pelanggan) => (
                                    <div
                                        key={pelanggan.id}
                                        className="cursor-pointer rounded-md border p-3 hover:bg-gray-50"
                                        onClick={() => {
                                            setSelectedPelanggan(pelanggan);
                                            setSearchTerm(pelanggan.nama);
                                            setPelangganList([]);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900">{pelanggan.nama}</p>
                                                <p className="text-sm text-gray-600">No. Meter: {pelanggan.nomor_meter}</p>
                                                <p className="text-sm text-gray-600">{pelanggan.email}</p>
                                            </div>
                                            {pelanggan.tarif && (
                                                <Badge variant="outline" className="text-xs">
                                                    {pelanggan.tarif.daya} VA
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Selected Pelanggan */}
                        {selectedPelanggan && (
                            <div className="rounded-lg border bg-blue-50 p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{selectedPelanggan.nama}</h4>
                                            <p className="text-sm text-gray-600">No. Meter: {selectedPelanggan.nomor_meter}</p>
                                            <p className="text-sm text-gray-600">{selectedPelanggan.email}</p>
                                            {selectedPelanggan.tarif && (
                                                <div className="mt-1 flex items-center gap-2">
                                                    <Zap className="h-4 w-4 text-yellow-600" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {selectedPelanggan.tarif.daya} VA - {formatCurrency(selectedPelanggan.tarif.tarif_per_kwh)}
                                                        /kWh
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedPelanggan(null);
                                            setSearchTerm('');
                                        }}
                                    >
                                        Ubah
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bulan">Bulan</Label>
                            <Select value={bulan} onValueChange={setBulan} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bulanOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tahun">Tahun</Label>
                            <Select value={tahun} onValueChange={setTahun} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tahunOptions.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jumlah-meter">Pemakaian (kWh)</Label>
                        <Input
                            id="jumlah-meter"
                            type="number"
                            placeholder="Masukkan jumlah pemakaian kWh"
                            value={jumlahMeter}
                            onChange={(e) => setJumlahMeter(e.target.value)}
                            min="0"
                            required
                        />
                        <p className="text-xs text-gray-500">Masukkan jumlah kWh yang dikonsumsi pada periode tersebut</p>
                    </div>

                    {/* Informasi Meter Awal */}
                    {meterAwalInfo && (
                        <div className="rounded-lg border bg-blue-50 p-4">
                            <h4 className="mb-2 font-semibold text-blue-900">Informasi Meter</h4>
                            <div className="space-y-1 text-sm">
                                {meterAwalInfo.has_previous ? (
                                    <div>
                                        <p className="text-blue-700">
                                            <strong>Meter Awal:</strong> {meterAwalInfo.meter_akhir} kWh
                                        </p>
                                        <p className="text-blue-600">
                                            (Meter akhir dari {getBulanName(meterAwalInfo.previous_month)} {meterAwalInfo.previous_year})
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-blue-700">
                                        <strong>Meter Awal:</strong> 0 kWh (Belum ada data bulan sebelumnya)
                                    </p>
                                )}
                                {jumlahMeter && (
                                    <p className="text-blue-700">
                                        <strong>Meter Akhir:</strong> {meterAwalInfo.meter_akhir + parseInt(jumlahMeter || '0')} kWh
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Estimasi Tagihan */}
                    {selectedPelanggan?.tarif && jumlahMeter && (
                        <div className="rounded-lg border bg-gray-50 p-4">
                            <h4 className="mb-3 font-semibold text-gray-900">Estimasi Tagihan</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pemakaian:</span>
                                    <span className="font-medium">{jumlahMeter} kWh</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tarif per kWh:</span>
                                    <span className="font-medium">{formatCurrency(selectedPelanggan.tarif.tarif_per_kwh)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Total Biaya Listrik:</span>
                                    <span className="text-blue-600">{formatCurrency(calculateEstimatedBill())}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic">*Belum termasuk biaya admin yang akan ditentukan saat pembayaran</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetForm();
                            }}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedPelanggan || !bulan || !tahun || !jumlahMeter || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting && (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></div>
                            )}
                            Buat Tagihan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
