import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { router } from '@inertiajs/react';
import { BarChart, FileText, Home, LogOut, Menu, Settings, User } from 'lucide-react';
import React from 'react';

interface PelangganLayoutProps {
    children: React.ReactNode;
}

export default function PelangganLayout({ children }: PelangganLayoutProps) {
    const handleLogout = () => {
        router.post(route('pelanggan.logout'));
    };

    const navigationItems = [
        { name: 'Dashboard', href: route('pelanggan.dashboard'), icon: Home },
        { name: 'Penggunaan Listrik', href: '#', icon: BarChart },
        { name: 'Tagihan', href: '#', icon: FileText },
        { name: 'Pengaturan', href: '#', icon: Settings },
        { name: 'Profil', href: '#', icon: User },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-blue-600">PetirPay</h1>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navigationItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className="flex items-center p-2 rounded-md hover:bg-gray-100"
                                >
                                    <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Keluar
                    </Button>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10 p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-blue-600">PetirPay</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-bold text-blue-600">PetirPay</h1>
                        </div>
                        <nav className="flex-1 p-4">
                            <ul className="space-y-1">
                                {navigationItems.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className="flex items-center p-2 rounded-md hover:bg-gray-100"
                                        >
                                            <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                                            <span>{item.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Keluar
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-0 mt-16 md:mt-0">{children}</main>
        </div>
    );
}
