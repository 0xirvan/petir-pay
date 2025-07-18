import React from 'react';
import { CustomerData } from './types';

interface WelcomeSectionProps {
    pelanggan: CustomerData;
}

export default function WelcomeSection({ pelanggan }: WelcomeSectionProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Selamat datang, {pelanggan.nama}!
            </h1>
            <p className="text-gray-600">Kelola tagihan listrik Anda dengan mudah dan aman</p>
        </div>
    );
}
