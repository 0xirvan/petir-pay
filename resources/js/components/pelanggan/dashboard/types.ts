export interface CustomerData {
    nama: string;
    id_pelanggan: string;
    alamat: string;
    daya: string;
    tarif: string;
}

export interface TagihanData {
    id: string;
    periode: string;
    pemakaian: number;
    tarif_per_kwh: number;
    total: string;
    status: 'belum_bayar' | 'lunas' | 'menunggu_konfirmasi' | 'terlambat';
    tanggal_bayar?: string;
    metode_pembayaran?: string;
}

export interface RiwayatPembayaran {
    id: string;
    tanggal: string;
    periode: string;
    jumlah: number;
    metode: string;
    status: 'berhasil' | 'gagal' | 'pending' | 'menunggu_verifikasi';
    no_referensi: string;
}

export interface MetodePembayaran {
    id: number;
    nama: string;
    kode: string;
    atas_nama: string;
    nomor_rekening: string;
    biaya_admin: string;
    deskripsi: string;
    logo: string | null;
    logo_url: string | null;
    is_aktif: boolean;
}

export interface DashboardProps {
    pelanggan: CustomerData;
    currentBill: TagihanData | null;
    riwayatTagihan: TagihanData[];
    riwayatPembayaran: RiwayatPembayaran[];
    metodePembayaran: MetodePembayaran[];
    statusDashboard: 'belum_bayar' | 'lunas';
}
