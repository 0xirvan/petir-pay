import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/utils';
import { CheckCircle, Receipt } from 'lucide-react';
import StatusBadge from './status-badge';
import { RiwayatPembayaran, TagihanData } from './types';

interface HistoryListProps {
    riwayatTagihan: TagihanData[];
    riwayatPembayaran: RiwayatPembayaran[];
}

export default function HistoryList({ riwayatTagihan, riwayatPembayaran }: HistoryListProps) {
    return (
        <div className="space-y-6">
            {/* Riwayat Tagihan */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Riwayat Tagihan</CardTitle>
                    <CardDescription>Daftar tagihan listrik Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {riwayatTagihan.length > 0 ? (
                            riwayatTagihan.map((tagihan) => (
                                <div
                                    key={tagihan.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                            <Receipt className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{tagihan.periode}</h4>
                                            <p className="text-sm text-gray-600">
                                                Pemakaian: {tagihan.pemakaian} kWh
                                                {tagihan.tanggal_bayar && ` • Dibayar: ${formatDate(tagihan.tanggal_bayar)}`}
                                            </p>
                                            {tagihan.metode_pembayaran && <p className="text-xs text-gray-500">via {tagihan.metode_pembayaran}</p>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatCurrency(tagihan.total)}</p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <StatusBadge status={tagihan.status} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-gray-500">Belum ada riwayat tagihan</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Riwayat Pembayaran */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Riwayat Pembayaran</CardTitle>
                    <CardDescription>Transaksi pembayaran yang telah dilakukan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {riwayatPembayaran.length > 0 ? (
                            riwayatPembayaran.map((pembayaran) => (
                                <div
                                    key={pembayaran.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{pembayaran.periode}</h4>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(pembayaran.tanggal)} • via {pembayaran.metode}
                                            </p>
                                            <p className="text-xs text-gray-500">Ref: {pembayaran.no_referensi}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{formatCurrency(pembayaran.jumlah)}</p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <StatusBadge status={pembayaran.status} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-gray-500">Belum ada riwayat pembayaran</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
