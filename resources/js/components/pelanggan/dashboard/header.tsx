import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Bell, LogOut, Settings, User, Zap } from 'lucide-react';
import { CustomerData } from './types';

interface HeaderProps {
    pelanggan: CustomerData;
}

export default function Header({ pelanggan }: HeaderProps) {
    const handleLogout = () => {
        router.post(route('pelanggan.logout'));
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
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
                            <div className="-mt-1 text-xs text-gray-500">Dashboard Pelanggan</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                        </Button>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{pelanggan.nama}</p>
                                <p className="text-xs text-gray-500">ID: {pelanggan.id_pelanggan}</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
                                <User className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
