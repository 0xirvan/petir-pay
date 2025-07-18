import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    switch (status) {
        case 'belum_bayar':
            return <Badge variant="destructive">Belum Bayar</Badge>;
        case 'lunas':
            return <Badge className="bg-green-100 text-green-800">Lunas</Badge>;
        case 'menunggu_konfirmasi':
            return <Badge className="bg-blue-100 text-blue-800">Menunggu Konfirmasi</Badge>;
        case 'terlambat':
            return <Badge className="bg-orange-100 text-orange-800">Terlambat</Badge>;
        case 'menunggu_verifikasi':
            return <Badge className="bg-blue-100 text-blue-800">Menunggu Verifikasi</Badge>;
        case 'berhasil':
            return <Badge className="bg-green-100 text-green-800">Berhasil</Badge>;
        case 'gagal':
            return <Badge variant="destructive">Gagal</Badge>;
        case 'pending':
            return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}
