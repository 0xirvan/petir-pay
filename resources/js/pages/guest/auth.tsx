import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, Gauge, Home, Lock, Mail, Shield, User, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface Tarif {
    id: number;
    daya: string;
}

interface TarifProps {
    daya: Tarif[];
}

export default function CustomerLogin({ daya }: TarifProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const {
        data: registerData,
        setData: setRegisterData,
        post: postRegister,
        processing: registerProcessing,
        errors: registerErrors,
    } = useForm({
        nama: '',
        email: '',
        password: '',
        password_confirmation: '',
        nomor_meter: '',
        alamat: '',
        tarif_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pelanggan.login.attempt'));
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postRegister(route('pelanggan.register'));
    };

    // Reusable input style classes
    const inputClasses = 'h-11 border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500';
    const errorInputClasses = 'border-red-400 focus:border-red-500 focus:ring-red-500';
    const iconClasses = 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-[18px] w-[18px]';

    const ErrorMessage = ({ message }: { message: string }) => <p className="mt-1 text-sm font-medium text-red-500">{message}</p>;

    return (
        <AppLayout title="Portal Pelanggan">
            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6 sm:p-8 md:p-10">
                <div className="w-full max-w-md">
                    {/* Login/Register Card */}
                    <Card className="overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur-md">
                        <CardHeader className="space-y-1 pt-8 pb-6 text-center">
                            <div className="mb-5 flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                                    <Zap className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">Portal Pelanggan</CardTitle>
                            <p className="text-sm text-gray-600">Masuk atau daftar sebagai pelanggan listrik pascabayar</p>
                        </CardHeader>

                        <CardContent className="px-6 pb-8 sm:px-8">
                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="mb-6 grid w-full grid-cols-2 rounded-xl bg-gray-100 p-1">
                                    <TabsTrigger
                                        value="login"
                                        className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    >
                                        Masuk
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="register"
                                        className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                    >
                                        Daftar
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="login" className="mt-2 space-y-5">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                Email
                                            </Label>
                                            <div className="relative">
                                                <Mail className={iconClasses} />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="nama@email.com"
                                                    className={`${inputClasses} ${errors.email ? errorInputClasses : ''}`}
                                                    required
                                                />
                                                {errors.email && <ErrorMessage message={errors.email} />}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className={iconClasses} />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Masukkan password"
                                                    className={`${inputClasses} ${errors.password ? errorInputClasses : ''}`}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                                {errors.password && <ErrorMessage message={errors.password} />}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="remember"
                                                    checked={data.remember}
                                                    onCheckedChange={(checked) => setData('remember', !!checked)}
                                                />
                                                <Label htmlFor="remember" className="text-sm text-gray-600">
                                                    Ingat saya
                                                </Label>
                                            </div>
                                            <a className="text-sm font-medium text-blue-600 hover:text-blue-700">Lupa password?</a>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-2 h-11 w-full bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                                            disabled={processing}
                                        >
                                            {processing ? 'Memproses...' : 'Masuk ke Portal'}
                                        </Button>
                                    </form>

                                    {/* Security Notice */}
                                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3.5">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="mt-0.5 h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-xs font-medium text-blue-800">Keamanan Terjamin</p>
                                                <p className="mt-0.5 text-xs text-blue-600/90">Data Anda dilindungi dengan enkripsi tingkat bank</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Register Tab */}
                                <TabsContent value="register" className="mt-2 space-y-4">
                                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Personal Info */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-name" className="text-sm font-medium text-gray-700">
                                                    Nama Lengkap
                                                </Label>
                                                <div className="relative">
                                                    <User className={iconClasses} />
                                                    <Input
                                                        id="reg-name"
                                                        type="text"
                                                        value={registerData.nama}
                                                        onChange={(e) => setRegisterData({ ...registerData, nama: e.target.value })}
                                                        placeholder="Masukkan nama lengkap"
                                                        className={`${inputClasses} ${registerErrors.nama ? errorInputClasses : ''}`}
                                                        required
                                                    />
                                                    {registerErrors.nama && <ErrorMessage message={registerErrors.nama} />}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
                                                    Email
                                                </Label>
                                                <div className="relative">
                                                    <Mail className={iconClasses} />
                                                    <Input
                                                        id="reg-email"
                                                        type="email"
                                                        value={registerData.email}
                                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                                        placeholder="nama@email.com"
                                                        className={`${inputClasses} ${registerErrors.email ? errorInputClasses : ''}`}
                                                        required
                                                    />
                                                    {registerErrors.email && <ErrorMessage message={registerErrors.email} />}
                                                </div>
                                            </div>

                                            {/* Meter Information */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-meter" className="text-sm font-medium text-gray-700">
                                                    Nomor Meter
                                                </Label>
                                                <div className="relative">
                                                    <Gauge className={iconClasses} />
                                                    <Input
                                                        id="reg-meter"
                                                        type="text"
                                                        value={registerData.nomor_meter}
                                                        onChange={(e) => setRegisterData({ ...registerData, nomor_meter: e.target.value })}
                                                        placeholder="Nomor meter listrik"
                                                        className={`${inputClasses} ${registerErrors.nomor_meter ? errorInputClasses : ''}`}
                                                        required
                                                    />
                                                    {registerErrors.nomor_meter && <ErrorMessage message={registerErrors.nomor_meter} />}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-power" className="text-sm font-medium text-gray-700">
                                                    Daya Listrik
                                                </Label>
                                                <Select
                                                    value={registerData.tarif_id}
                                                    onValueChange={(value) => setRegisterData({ ...registerData, tarif_id: value })}
                                                >
                                                    <SelectTrigger
                                                        className={`h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${registerErrors.tarif_id ? errorInputClasses : ''}`}
                                                    >
                                                        <SelectValue placeholder="Pilih daya listrik" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {daya.map((item) => (
                                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                                {item.daya} VA
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="mt-1 text-xs text-gray-500">Pilih daya listrik sesuai dengan meteran Anda</p>
                                                {registerErrors.tarif_id && <ErrorMessage message={registerErrors.tarif_id} />}
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-address" className="text-sm font-medium text-gray-700">
                                                    Alamat
                                                </Label>
                                                <div className="relative">
                                                    <Home className={iconClasses} />
                                                    <Input
                                                        id="reg-address"
                                                        type="text"
                                                        value={registerData.alamat}
                                                        onChange={(e) => setRegisterData({ ...registerData, alamat: e.target.value })}
                                                        placeholder="Alamat lengkap"
                                                        className={`${inputClasses} ${registerErrors.alamat ? errorInputClasses : ''}`}
                                                    />
                                                    {registerErrors.alamat && <ErrorMessage message={registerErrors.alamat} />}
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className={iconClasses} />
                                                    <Input
                                                        id="reg-password"
                                                        type="password"
                                                        value={registerData.password}
                                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                                        placeholder="Masukkan password"
                                                        className={`${inputClasses} ${registerErrors.password ? errorInputClasses : ''}`}
                                                        required
                                                    />
                                                    {registerErrors.password && <ErrorMessage message={registerErrors.password} />}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="reg-password-confirm" className="text-sm font-medium text-gray-700">
                                                    Konfirmasi Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className={iconClasses} />
                                                    <Input
                                                        id="reg-password-confirm"
                                                        type="password"
                                                        value={registerData.password_confirmation}
                                                        onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                                                        placeholder="Konfirmasi password"
                                                        className={`${inputClasses} ${registerErrors.password_confirmation ? errorInputClasses : ''}`}
                                                        required
                                                    />
                                                    {registerErrors.password_confirmation && (
                                                        <ErrorMessage message={registerErrors.password_confirmation} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-1 h-11 w-full bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                                            disabled={registerProcessing}
                                        >
                                            {registerProcessing ? 'Memproses...' : 'Daftar Sekarang'}
                                        </Button>
                                    </form>

                                    {/* Terms Notice */}
                                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3.5">
                                        <p className="text-center text-xs text-gray-600">
                                            Dengan mendaftar, Anda menyetujui{' '}
                                            <a className="font-medium text-blue-600 hover:text-blue-700">Syarat & Ketentuan</a> dan{' '}
                                            <a className="font-medium text-blue-600 hover:text-blue-700">Kebijakan Privasi</a> kami.
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
