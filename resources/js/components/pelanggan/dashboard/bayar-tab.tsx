import { TabsContent } from '@/components/ui/tabs';
import PaymentTab from './payment-tab';
import { MetodePembayaran, TagihanData } from './types';

interface BayarTabProps {
    currentBill: TagihanData | null;
    metodePembayaran: MetodePembayaran[];
    onPaymentSuccess?: () => void;
}

export default function BayarTab({ currentBill, metodePembayaran, onPaymentSuccess }: BayarTabProps) {
    return (
        <TabsContent value="bayar" className="space-y-6">
            <PaymentTab currentBill={currentBill} metodePembayaran={metodePembayaran} onPaymentSuccess={onPaymentSuccess} />
        </TabsContent>
    );
}
