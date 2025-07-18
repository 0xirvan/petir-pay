import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CustomerData } from './types';

interface CustomerInfoCardProps {
    pelanggan: CustomerData;
}

export default function CustomerInfoCard({ pelanggan }: CustomerInfoCardProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div>
                        <Label className="text-gray-600">Nama Pelanggan</Label>
                        <p className="font-semibold">{pelanggan.nama}</p>
                    </div>
                    <div>
                        <Label className="text-gray-600">ID Pelanggan</Label>
                        <p className="font-semibold">{pelanggan.id_pelanggan}</p>
                    </div>
                    <div>
                        <Label className="text-gray-600">Alamat</Label>
                        <p className="font-semibold">{pelanggan.alamat}</p>
                    </div>
                    <div>
                        <Label className="text-gray-600">Daya Terpasang</Label>
                        <p className="font-semibold">{pelanggan.daya}</p>
                    </div>
                    <div>
                        <Label className="text-gray-600">Golongan Tarif</Label>
                        <p className="font-semibold">{pelanggan.tarif}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
