import { TabsContent } from '@/components/ui/tabs';
import CurrentBillCard from './current-bill-card';
import CustomerInfoCard from './customer-Info-card';
import { CustomerData, TagihanData } from './types';

interface OverviewTabProps {
    pelanggan: CustomerData;
    currentBill: TagihanData | null;
    onBayarClick: () => void;
}

export default function OverviewTab({ pelanggan, currentBill, onBayarClick }: OverviewTabProps) {
    return (
        <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <CurrentBillCard currentBill={currentBill} onBayarClick={onBayarClick} />
                <CustomerInfoCard pelanggan={pelanggan} />
            </div>
        </TabsContent>
    );
}
