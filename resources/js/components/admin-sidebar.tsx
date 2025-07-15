import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calculator, CreditCard, Home, Receipt, Settings, User, Users, X, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    adminName: string;
    adminRole: string;
    adminPhoto: string;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, adminName = 'Jhon Doe', adminRole = 'Damn', adminPhoto }: AdminSidebarProps) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.role;

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, route: 'admin.dashboard', forRoles: ['administrator, petugas'] },
        { id: 'tarif', label: 'Kelola Tarif', icon: Calculator, route: 'admin.kelola-tarif', forRoles: ['administrator'] },
        { id: 'admin', label: 'Kelola Admin', icon: Users, route: 'admin.kelola-admin', forRoles: ['administrator'] },
        { id: 'pelanggan', label: 'Data Pelanggan', icon: User, route: 'admin.data-pelanggan', forRoles: ['administrator', 'petugas'] },
        { id: 'tagihan', label: 'Verifikasi Tagihan', icon: Receipt, route: 'admin.dashboard', forRoles: ['administrator'] },
        { id: 'riwayat', label: 'Riwayat Pembayaran', icon: CreditCard, route: 'admin.dashboard', forRoles: ['administrator'] },
        { id: 'settings', label: 'Pengaturan', icon: Settings, route: 'admin.dashboard', forRoles: ['administrator'] },
    ];

    return (
        <aside
            className={`fixed top-16 bottom-0 left-0 z-50 w-64 transform bg-white/95 shadow-lg backdrop-blur-md transition-transform duration-300 ease-in-out lg:fixed lg:z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}
        >
            {/* Sidebar Header - Mobile Only */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden">
                <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-blue-600">PetirPay</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                {sidebarItems
                    .filter((item) => item.forRoles.some((allowedRole) => allowedRole.includes(role)))
                    .map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                href={route(item.route)}
                                key={item.id}
                                onClick={() => {
                                    setSidebarOpen(false); // Close sidebar on mobile after selection
                                }}
                                className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                                    route().current(item.route) ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={adminPhoto} alt={adminName} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{adminName}</p>
                        <p className="truncate text-xs text-gray-500">{adminRole.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
