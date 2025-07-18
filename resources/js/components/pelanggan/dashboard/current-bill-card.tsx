import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/utils';
import StatusBadge from './status-badge';
import { TagihanData } from './types';

interface CurrentBillCardProps {
    currentBill: TagihanData | null;
    onBayarClick: () => void;
}

export default function CurrentBillCard({ currentBill, onBayarClick }: CurrentBillCardProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Tagihan Terbaru</CardTitle>
                    {currentBill && <StatusBadge status={currentBill.status} />}
                </div>
                <CardDescription>{currentBill ? `Periode ${currentBill.periode}` : 'Tidak ada tagihan aktif'}</CardDescription>
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
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onBayarClick}>
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
    );
}
