import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Wallet, X } from 'lucide-react';
import React, { useState } from 'react';
import { MetodePembayaran, TagihanData } from './types';

interface PaymentFormProps {
    currentBill: TagihanData | null;
    metodePembayaran: MetodePembayaran[];
    selectedPaymentMethod: MetodePembayaran | null;
    setSelectedPaymentMethod: (method: MetodePembayaran | null) => void;
}

export default function PaymentForm({ currentBill, metodePembayaran, selectedPaymentMethod, setSelectedPaymentMethod }: PaymentFormProps) {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [uploadedProof, setUploadedProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numAmount);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                alert('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
                return;
            }

            if (file.size > maxSize) {
                alert('Ukuran file terlalu besar. Maksimal 5MB.');
                return;
            }

            setUploadedProof(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleManualPayment = async () => {
        if (!uploadedProof || !currentBill) {
            alert('Silakan upload bukti pembayaran terlebih dahulu');
            return;
        }

        setIsProcessingPayment(true);

        const formData = new FormData();
        formData.append('tagihan_id', currentBill.id);
        formData.append('bukti_transfer', uploadedProof);

        router.post(route('pelanggan.upload-bukti-pembayaran'), formData, {
            onSuccess: () => {
                setUploadedProof(null);
                setPreviewUrl(null);
                setSelectedPaymentMethod(null);
                setIsProcessingPayment(false);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                setIsProcessingPayment(false);
            },
        });
    };

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
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Pembayaran Manual</CardTitle>
                <CardDescription>Pilih metode pembayaran dan upload bukti transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="payment-method" className="font-medium text-gray-700">
                            Metode Pembayaran
                        </Label>
                        <div className="mt-2 grid gap-3">
                            {metodePembayaran.map((metode) => (
                                <div
                                    key={metode.id}
                                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                        selectedPaymentMethod?.id === metode.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedPaymentMethod(metode)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                                <Wallet className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{metode.nama}</p>
                                                <p className="text-sm text-gray-500">{metode.deskripsi}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Biaya admin: {formatCurrency(metode.biaya_admin)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedPaymentMethod && (
                        <div className="space-y-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                            <div className="text-center">
                                <h4 className="mb-2 font-semibold text-indigo-900">Informasi Transfer {selectedPaymentMethod.nama}</h4>
                                <div className="rounded-lg border border-indigo-200 bg-white p-4 text-left">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bank:</span>
                                            <span className="font-semibold">{selectedPaymentMethod.nama}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">No. Rekening:</span>
                                            <span className="font-semibold">{selectedPaymentMethod.nomor_rekening}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Atas Nama:</span>
                                            <span className="font-semibold">{selectedPaymentMethod.atas_nama}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="text-gray-600">Jumlah Transfer:</span>
                                            <span className="font-bold text-indigo-600">
                                                {formatCurrency(parseFloat(currentBill.total) + parseFloat(selectedPaymentMethod.biaya_admin))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="payment-proof" className="font-medium text-gray-700">
                                    Upload Bukti Pembayaran
                                </Label>
                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-indigo-400">
                                    <input id="payment-proof" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                    <label htmlFor="payment-proof" className="flex cursor-pointer flex-col items-center space-y-2">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Klik untuk upload foto</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                                        </div>
                                    </label>
                                </div>

                                {previewUrl && (
                                    <div className="mt-4">
                                        <Label className="mb-2 block font-medium text-gray-700">Preview Bukti Pembayaran:</Label>
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Preview bukti pembayaran"
                                                className="mx-auto w-full max-w-sm rounded-lg border border-gray-200 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadedProof(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="mt-2 text-center text-xs text-gray-500">
                                            File: {uploadedProof?.name} ({((uploadedProof?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                <div className="flex items-start space-x-2">
                                    <svg className="mt-0.5 h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Penting!</p>
                                        <ul className="mt-1 space-y-1 text-xs text-yellow-700">
                                            <li>• Pastikan foto bukti transfer jelas dan dapat dibaca</li>
                                            <li>• Jumlah transfer harus sesuai dengan total tagihan</li>
                                            <li>• Verifikasi pembayaran membutuhkan waktu 1x24 jam</li>
                                            <li>• Anda akan mendapat notifikasi setelah pembayaran diverifikasi</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleManualPayment}
                    disabled={!uploadedProof || !selectedPaymentMethod || isProcessingPayment}
                    className="h-12 w-full bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl"
                >
                    {isProcessingPayment ? 'Mengupload Bukti...' : 'Upload Bukti Pembayaran'}
                </Button>
            </CardContent>
        </Card>
    );
}
