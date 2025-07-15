import { router } from '@inertiajs/react';
import { LogOut, Menu, User, Zap } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface AdminHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    adminName: string;
    adminRole: string;
    adminPhoto: string;
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen, adminName = 'Jhon Doe', adminRole = 'Damn', adminPhoto }: AdminHeaderProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        const logoutUrl = typeof route !== 'undefined' ? route('admin.logout') : '/admin/logout';

        router.post(
            logoutUrl,
            {},
            {
                onSuccess: () => {
                    // Redirect will be handled by Laravel after successful logout
                },
                onError: (errors) => {
                    console.error('Logout failed:', errors);
                    setIsLoggingOut(false);
                },
                onFinish: () => {
                    setIsLoggingOut(false);
                },
            },
        );
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
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
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden items-center space-x-3 sm:flex">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{adminName}</p>
                                <p className="text-xs text-gray-500">{adminRole.toLocaleUpperCase()}</p>
                            </div>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={adminPhoto} alt={adminName} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            title={isLoggingOut ? 'Logging out...' : 'Logout'}
                            className="transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut className={`h-5 w-5 ${isLoggingOut ? 'animate-spin' : 'text-gray-600'}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
