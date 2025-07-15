import { DeleteDialog } from '@/components/delete-dialog';
import { MetodePembayaranFormDialog } from '@/components/metode-pembayaran-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/utils/utils';
import { router, usePage } from '@inertiajs/react';
import { CreditCard, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetodePembayaran {
    id: number;
    nama: string;
    kode: string;
    atas_nama: string;
    nomor_rekening: string | null;
    biaya_admin: number;
    deskripsi: string | null;
    logo: string | null;
    logo_url: string | null;
    is_aktif: boolean;
    created_at: string;
    updated_at: string;
}

interface KelolaMetodePembayaranProps {
    title: string;
    metodePembayaranList: MetodePembayaran[];
}

export default function KelolaMetodePembayaran({ metodePembayaranList, title }: KelolaMetodePembayaranProps) {
    const { props } = usePage<{ metodePembayaranBaru?: MetodePembayaran }>();
    const [metodePembayaranListState, setMetodePembayaranListState] = useState(metodePembayaranList);

    useEffect(() => {
        if (props.metodePembayaranBaru) {
            setMetodePembayaranListState((prev) => [props.metodePembayaranBaru!, ...prev]);
        }
    }, [props.metodePembayaranBaru]);

    useEffect(() => {
        setMetodePembayaranListState(metodePembayaranList);
    }, [metodePembayaranList]);

    const handleToggleStatus = (id: number) => {
        router.patch(
            route('admin.kelola-metode-pembayaran.toggle-status', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMetodePembayaranListState((prev) => prev.map((item) => (item.id === id ? { ...item, is_aktif: !item.is_aktif } : item)));
                },
            },
        );
    };

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Kelola Metode Pembayaran</h1>
                        <p className="text-gray-600">Atur metode pembayaran yang tersedia untuk pelanggan</p>
                    </div>
                    <MetodePembayaranFormDialog
                        title="Tambah Metode Pembayaran Baru"
                        description="Masukkan informasi metode pembayaran baru"
                        fields={[
                            { id: 'nama', label: 'Nama Metode', placeholder: 'Contoh: Bank Mandiri', required: true, type: 'text' },
                            { id: 'kode', label: 'Kode', placeholder: 'Contoh: MANDIRI', required: true, type: 'text' },
                            { id: 'atas_nama', label: 'Atas Nama', placeholder: 'Contoh: PT Petir Pay', required: true, type: 'text' },
                            { id: 'nomor_rekening', label: 'Nomor Rekening', placeholder: 'Contoh: 1234567890', required: false, type: 'text' },
                            { id: 'biaya_admin', label: 'Biaya Admin (Rp)', placeholder: 'Contoh: 2500', required: true, type: 'number' },
                            { id: 'deskripsi', label: 'Deskripsi', placeholder: 'Deskripsi metode pembayaran', required: false, type: 'textarea' },
                            { id: 'logo', label: 'Logo', required: false, type: 'file', accept: 'image/*' },
                            { id: 'is_aktif', label: 'Status Aktif', required: false, type: 'checkbox', defaultChecked: true },
                        ]}
                        action={route('admin.kelola-metode-pembayaran.store')}
                        method="post"
                        triggerText="Tambah Metode Pembayaran"
                        triggerIcon={<CreditCard className="mr-2 h-4 w-4" />}
                    />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {metodePembayaranListState.map((metode) => (
                        <Card key={metode.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {metode.logo_url ? (
                                            <img src={metode.logo_url} alt={metode.nama} className="h-10 w-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                                                <CreditCard className="h-5 w-5 text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{metode.nama}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {metode.kode}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={metode.is_aktif ? 'default' : 'secondary'}
                                        className={metode.is_aktif ? 'bg-green-600 hover:bg-green-700' : ''}
                                    >
                                        {metode.is_aktif ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>

                                <div className="mb-4 space-y-2">
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-700">Atas Nama:</span>
                                        <p className="text-gray-900">{metode.atas_nama}</p>
                                    </div>
                                    {metode.nomor_rekening && (
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-700">No. Rekening:</span>
                                            <p className="font-mono text-gray-900">{metode.nomor_rekening}</p>
                                        </div>
                                    )}
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-700">Biaya Admin:</span>
                                        <p className="font-semibold text-gray-900">{formatCurrency(metode.biaya_admin)}</p>
                                    </div>
                                    {metode.deskripsi && (
                                        <div className="text-sm">
                                            <span className="font-medium text-gray-700">Deskripsi:</span>
                                            <p className="text-gray-600">{metode.deskripsi}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <MetodePembayaranFormDialog
                                        title="Edit Metode Pembayaran"
                                        description="Ubah informasi metode pembayaran"
                                        fields={[
                                            {
                                                id: 'nama',
                                                label: 'Nama Metode',
                                                placeholder: 'Contoh: Bank Mandiri',
                                                required: true,
                                                type: 'text',
                                                defaultValue: metode.nama,
                                            },
                                            {
                                                id: 'kode',
                                                label: 'Kode',
                                                placeholder: 'Contoh: MANDIRI',
                                                required: true,
                                                type: 'text',
                                                defaultValue: metode.kode,
                                            },
                                            {
                                                id: 'atas_nama',
                                                label: 'Atas Nama',
                                                placeholder: 'Contoh: PT Petir Pay',
                                                required: true,
                                                type: 'text',
                                                defaultValue: metode.atas_nama,
                                            },
                                            {
                                                id: 'nomor_rekening',
                                                label: 'Nomor Rekening',
                                                placeholder: 'Contoh: 1234567890',
                                                required: false,
                                                type: 'text',
                                                defaultValue: metode.nomor_rekening || '',
                                            },
                                            {
                                                id: 'biaya_admin',
                                                label: 'Biaya Admin (Rp)',
                                                placeholder: 'Contoh: 2500',
                                                required: true,
                                                type: 'number',
                                                defaultValue: metode.biaya_admin.toString(),
                                            },
                                            {
                                                id: 'deskripsi',
                                                label: 'Deskripsi',
                                                placeholder: 'Deskripsi metode pembayaran',
                                                required: false,
                                                type: 'textarea',
                                                defaultValue: metode.deskripsi || '',
                                            },
                                            {
                                                id: 'logo',
                                                label: 'Logo (kosongkan jika tidak ingin mengubah)',
                                                required: false,
                                                type: 'file',
                                                accept: 'image/*',
                                            },
                                            {
                                                id: 'is_aktif',
                                                label: 'Status Aktif',
                                                required: false,
                                                type: 'checkbox',
                                                defaultChecked: metode.is_aktif,
                                            },
                                        ]}
                                        action={route('admin.kelola-metode-pembayaran.update', metode.id)}
                                        method="put"
                                        trigger={
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        }
                                    />

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleStatus(metode.id)}
                                        title={metode.is_aktif ? 'Nonaktifkan' : 'Aktifkan'}
                                    >
                                        {metode.is_aktif ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>

                                    <DeleteDialog
                                        title="Hapus Metode Pembayaran"
                                        description={`Apakah Anda yakin ingin menghapus metode pembayaran "${metode.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                                        action={route('admin.kelola-metode-pembayaran.destroy', metode.id)}
                                        itemName={metode.nama}
                                        trigger={
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {metodePembayaranListState.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">Belum ada metode pembayaran</h3>
                            <p className="text-gray-600">Tambahkan metode pembayaran pertama untuk memulai</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
