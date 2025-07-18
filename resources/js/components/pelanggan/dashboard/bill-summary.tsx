import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { TagihanData, MetodePembayaran } from './types';

interface BillSummaryProps {
    currentBill: TagihanData | null;
    selectedPaymentMethod: MetodePembayaran | null;
}

export default function BillSummary({ currentBill, selectedPaymentMethod }: BillSummaryProps) {
    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(numAmount);
    };

    if (!currentBill) {
        return null;
    }

    return (
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
                            {selectedPaymentMethod ? formatCurrency(selectedPaymentMethod.biaya_admin) : "Rp 0"}
                        </span>
                    </div>
                    <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Pembayaran</span>
                            <span className="text-blue-600">
                                {formatCurrency(
                                    parseFloat(currentBill.total) + (selectedPaymentMethod ? parseFloat(selectedPaymentMethod.biaya_admin) : 0)
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Pembayaran aman dan terenkripsi</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
