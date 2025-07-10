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
            <aside className="hidden w-64 flex-col border-r bg-white md:flex">
                <div className="border-b p-4">
                    <h1 className="text-xl font-bold text-blue-600">PetirPay</h1>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navigationItems.map((item) => (
                            <li key={item.name}>
                                <a href={item.href} className="flex items-center rounded-md p-2 hover:bg-gray-100">
                                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="border-t p-4">
                    <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5" />
                        Keluar
                    </Button>
                </div>
            </aside>

            {/* Mobile Navigation */}
            <div className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between border-b bg-white p-4 md:hidden">
                <h1 className="text-xl font-bold text-blue-600">PetirPay</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="border-b p-4">
                            <h1 className="text-xl font-bold text-blue-600">PetirPay</h1>
                        </div>
                        <nav className="flex-1 p-4">
                            <ul className="space-y-1">
                                {navigationItems.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="flex items-center rounded-md p-2 hover:bg-gray-100">
                                            <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                                            <span>{item.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="border-t p-4">
                            <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                                <LogOut className="mr-3 h-5 w-5" />
                                Keluar
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="mt-16 flex-1 md:mt-0 md:ml-0">{children}</main>
        </div>
    );
}
