import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { router, useForm } from '@inertiajs/react';
import { Camera, Eye, EyeOff, Lock, Trash2, Upload, User } from 'lucide-react';
import { useRef, useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    photo_profile: string | null;
    photo_profile_url: string | null;
    created_at: string;
    email_verified_at: string | null;
}

interface PengaturanProps {
    title: string;
    user: UserData;
}

export default function Pengaturan({ title, user }: PengaturanProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form for profile update
    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    // Form for password update
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Form for photo upload
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('admin.pengaturan.update-profile'), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(route('admin.pengaturan.update-password'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log('File selected:', file);

        if (file) {
            // Check file size (2MB = 2048KB)
            if (file.size > 2048 * 1024) {
                console.error('File too large:', file.size);
                alert('Ukuran file terlalu besar. Maksimal 2MB.');
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                console.error('Invalid file type:', file.type);
                alert('Tipe file tidak didukung. Gunakan JPEG, PNG, JPG, atau GIF.');
                return;
            }

            setUploadingPhoto(true);

            const formData = new FormData();
            formData.append('photo', file);

            router.post(route('admin.pengaturan.update-photo'), formData, {
                preserveScroll: true,
                forceFormData: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onStart: () => {
                    console.log('Upload started');
                },
                onProgress: (progress: any) => {
                    console.log('Upload progress:', progress);
                },
                onSuccess: (page: any) => {
                    console.log('Upload success:', page);
                    console.log('Success page props:', page.props);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    setUploadingPhoto(false);
                    // Refresh page
                    window.location.reload();
                },
                onError: (errors: any) => {
                    console.error('Upload error:', errors);
                    console.log('Full error object:', errors);
                    setUploadingPhoto(false);
                },
                onFinish: () => {
                    console.log('Upload finished');
                    setUploadingPhoto(false);
                },
            });
        }
    };

    const handleDeletePhoto = () => {
        if (confirm('Apakah Anda yakin ingin menghapus foto profil?')) {
            router.delete(route('admin.pengaturan.delete-photo'), {
                preserveScroll: true,
            });
        }
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            administrator: { label: 'Administrator', className: 'bg-purple-500 hover:bg-purple-600' },
            petugas: { label: 'Petugas', className: 'bg-blue-500 hover:bg-blue-600' },
        };

        const config = roleConfig[role as keyof typeof roleConfig] || { label: role, className: 'bg-gray-500' };
        return <Badge className={`text-white ${config.className}`}>{config.label}</Badge>;
    };

    return (
        <AdminLayout title={title}>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">Pengaturan Akun</h1>
                    <p className="text-gray-600">Kelola profil, password, dan pengaturan akun Anda</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Info Card */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Info Profil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user.photo_profile_url || ''} alt={user.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-xl text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="sm"
                                        className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingPhoto}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>

                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {uploadingPhoto ? 'Uploading...' : 'Upload Foto'}
                                    </Button>
                                    {user.photo_profile && (
                                        <Button variant="outline" size="sm" onClick={handleDeletePhoto} className="text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* User Info */}
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Nama</Label>
                                    <p className="mt-1 text-gray-900">{user.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                                    <p className="mt-1 text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                                    <div className="mt-1">{getRoleBadge(user.role)}</div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Bergabung</Label>
                                    <p className="mt-1 text-gray-900">{user.created_at}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Status Email</Label>
                                    <div className="mt-1">
                                        <Badge
                                            variant={user.email_verified_at ? 'default' : 'secondary'}
                                            className={user.email_verified_at ? 'bg-green-500' : ''}
                                        >
                                            {user.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings Forms */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Update Profile */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Update Profil</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className={profileForm.errors.name ? 'border-red-500' : ''}
                                        />
                                        {profileForm.errors.name && <p className="mt-1 text-sm text-red-600">{profileForm.errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className={profileForm.errors.email ? 'border-red-500' : ''}
                                        />
                                        {profileForm.errors.email && <p className="mt-1 text-sm text-red-600">{profileForm.errors.email}</p>}
                                    </div>

                                    <Button type="submit" disabled={profileForm.processing}>
                                        {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Change Password */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Ubah Password
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="current_password">Password Saat Ini</Label>
                                        <div className="relative">
                                            <Input
                                                id="current_password"
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                className={passwordForm.errors.current_password ? 'border-red-500 pr-10' : 'pr-10'}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        {passwordForm.errors.current_password && (
                                            <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="password">Password Baru</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className={passwordForm.errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        {passwordForm.errors.password && <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                className="pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={passwordForm.processing}>
                                        {passwordForm.processing ? 'Mengubah...' : 'Ubah Password'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
