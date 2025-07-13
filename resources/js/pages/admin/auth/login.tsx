import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, Shield, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Trim data sebelum dikirim
        const trimmedData = {
            email: data.email.trim(),
            password: data.password.trim(),
            remember: data.remember,
        };
        setData(trimmedData as any);
        post(route('admin.login'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
                            </div>
                            <div>
                                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent">
                                    PetirPay
                                </span>
                                <div className="-mt-1 text-xs text-gray-500">Admin Portal</div>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600" onClick={() => router.visit('/')}>
                            ← Kembali ke Beranda
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-md">
                        <CardHeader className="space-y-1 pb-6 text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                    <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
                                        <Lock className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-gray-900">Admin Portal</CardTitle>
                            <CardDescription className="text-base text-gray-600">
                                Masuk ke sistem manajemen pembayaran listrik pascabayar
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-8 pb-8">
                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                    <p className="text-sm font-medium text-green-800">{status}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-medium text-gray-700">
                                        Email Administrator
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData({ ...data, email: e.target.value })}
                                            placeholder="admin@petirpay.id"
                                            className={`h-12 border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                                            autoComplete="username"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData({ ...data, password: e.target.value })}
                                            placeholder="Masukkan password"
                                            className={`h-12 border-gray-200 pr-10 pl-10 focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData({ ...data, remember: !!checked })}
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-600">
                                            Ingat saya
                                        </Label>
                                    </div>
                                    {canResetPassword && (
                                        <button
                                            type="button"
                                            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                                            onClick={() => alert('Fitur reset password akan segera tersedia')}
                                        >
                                            Lupa password?
                                        </button>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                                    disabled={processing}
                                >
                                    {processing ? 'Memverifikasi...' : 'Masuk ke Admin Portal'}
                                </Button>
                            </form>

                            {/* Security Notice */}
                            <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
                                <div className="flex items-start space-x-3">
                                    <Shield className="mt-0.5 h-5 w-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-medium text-orange-800">Akses Terbatas</p>
                                        <p className="mt-1 text-xs text-orange-600">
                                            Portal ini hanya untuk administrator dan petugas sistem. Semua aktivitas akan dicatat dan dimonitor.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help Section */}
                    <div className="mt-8 text-center">
                        <p className="mb-4 text-sm text-gray-600">Butuh bantuan teknis?</p>
                        <div className="flex justify-center space-x-6">
                            <button
                                type="button"
                                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                                onClick={() => alert('IT Support: it-support@listrikpay.id')}
                            >
                                Hubungi IT Support
                            </button>
                            <button
                                type="button"
                                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                                onClick={() => alert('Panduan admin akan segera tersedia')}
                            >
                                Panduan Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
