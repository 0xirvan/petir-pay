import { DeleteDialog } from '@/components/delete-dialog';
import { FormDialog } from '@/components/form-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/utils/utils';
import { usePage } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Tarif {
    id: number;
    daya: string;
    tarif_per_kwh: number;
    deskripsi: string;
}

interface KelolaTarifProps {
    title: string;
    tarifList: Tarif[];
}

export default function KelolaTarif({ tarifList, title }: KelolaTarifProps) {
    const { props } = usePage<{ tarifBaru?: Tarif }>();
    const [tarifListState, setTarifListState] = useState(tarifList);

    useEffect(() => {
        if (props.tarifBaru) {
            setTarifListState((prev) => [props.tarifBaru!, ...prev]);
        }
    }, [props.tarifBaru]);

    useEffect(() => {
        setTarifListState(tarifList);
    }, [tarifList]);

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Kelola Tarif Listrik</h1>
                        <p className="text-gray-600">Atur tarif listrik untuk berbagai daya terpasang</p>
                    </div>
                    <FormDialog
                        title="Tambah Tarif Baru"
                        description="Masukkan informasi tarif listrik baru"
                        fields={[
                            { id: 'daya', label: 'Daya (VA)', placeholder: 'Contoh: 2200', required: true, type: 'number' },
                            { id: 'tarif_per_kwh', label: 'Tarif per kWh (Rp)', placeholder: 'Contoh: 1445', required: true, type: 'number' },
                            { id: 'deskripsi', label: 'Deskripsi', placeholder: 'Contoh: Untuk rumah besar' },
                        ]}
                        triggerText="Tambah Tarif"
                        submitText="Simpan Tarif"
                        action={route('admin.kelola-tarif.store')}
                        method="post"
                    />
                </div>

                <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {tarifListState.map((tarif) => (
                                <div key={tarif.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{tarif.daya} VA</h3>
                                        <p className="text-gray-600">{tarif.deskripsi}</p>
                                        <p className="font-medium text-blue-600">{formatCurrency(tarif.tarif_per_kwh)} per kWh</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FormDialog
                                            mode="edit"
                                            title="Edit Tarif"
                                            description="Ubah informasi tarif listrik"
                                            fields={[
                                                { id: 'daya', label: 'Daya (VA)', placeholder: 'Contoh: 2200', required: true, type: 'number' },
                                                {
                                                    id: 'tarif_per_kwh',
                                                    label: 'Tarif per kWh (Rp)',
                                                    placeholder: 'Contoh: 1445',
                                                    required: true,
                                                    type: 'number',
                                                },
                                                { id: 'deskripsi', label: 'Deskripsi', placeholder: 'Contoh: Untuk rumah besar' },
                                            ]}
                                            initialData={{
                                                daya: tarif.daya.toString(),
                                                tarif_per_kwh: tarif.tarif_per_kwh.toString(),
                                                deskripsi: tarif.deskripsi || '',
                                            }}
                                            action={route('admin.kelola-tarif.update', tarif.id)}
                                            method="put"
                                            trigger={
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                        <DeleteDialog
                                            title="Hapus Tarif"
                                            itemName={`tarif ${tarif.daya} VA`}
                                            action={route('admin.kelola-tarif.destroy', tarif.id)}
                                            onSuccess={() => {
                                                // Data akan update otomatis melalui flash message dan props
                                                setTarifListState((prev) => prev.filter((t) => t.id !== tarif.id));
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
