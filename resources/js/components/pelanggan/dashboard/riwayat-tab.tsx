import { TabsContent } from '@/components/ui/tabs';
import HistoryList from './history-list';
import { RiwayatPembayaran, TagihanData } from './types';

interface RiwayatTabProps {
    riwayatTagihan: TagihanData[];
    riwayatPembayaran: RiwayatPembayaran[];
}

export default function RiwayatTab({ riwayatTagihan, riwayatPembayaran }: RiwayatTabProps) {
    return (
        <TabsContent value="riwayat" className="space-y-6">
            <HistoryList riwayatTagihan={riwayatTagihan} riwayatPembayaran={riwayatPembayaran} />
        </TabsContent>
    );
}
