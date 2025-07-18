import { Card, CardContent } from '@/components/ui/card';
import { Receipt, TrendingUp, Zap } from 'lucide-react';
import { CustomerData, TagihanData } from './types';

interface QuickStatsProps {
    pelanggan: CustomerData;
    currentBill: TagihanData | null;
    statusDashboard: 'belum_bayar' | 'lunas';
}

export default function QuickStats({ pelanggan, currentBill, statusDashboard }: QuickStatsProps) {
    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numAmount);
    };

    return (
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
    );
}
