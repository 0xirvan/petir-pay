import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import BillSummary from './bill-summary';
import PaymentForm from './payment-form';
import { MetodePembayaran, TagihanData } from './types';

interface PaymentTabProps {
    currentBill: TagihanData | null;
    metodePembayaran: MetodePembayaran[];
}

export default function PaymentTab({ currentBill, metodePembayaran }: PaymentTabProps) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<MetodePembayaran | null>(null);

    if (!currentBill) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                    <p className="text-lg text-gray-500">Tidak ada tagihan yang perlu dibayar</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <PaymentForm
                currentBill={currentBill}
                metodePembayaran={metodePembayaran}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
            <BillSummary currentBill={currentBill} selectedPaymentMethod={selectedPaymentMethod} />
        </div>
    );
}
