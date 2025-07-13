import AdminHeader from '@/components/admin-header';
import AdminSidebar from '@/components/admin-sidebar';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout(props: AdminLayoutProps) {
    const { name, url, auth } = usePage<SharedData>().props;

    const page = usePage();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const currentPage = page.component;

        if (currentPage) {
            const pageName = currentPage.toLowerCase();
            if (pageName.includes('dashboard')) {
                setActiveTab('dashboard');
                return;
            } else if (pageName.includes('pelanggan')) {
                setActiveTab('pelanggan');
                return;
            } else if (pageName.includes('tagihan')) {
                setActiveTab('tagihan');
                return;
            } else if (pageName.includes('admin')) {
                setActiveTab('admin');
                return;
            } else if (pageName.includes('settings')) {
                setActiveTab('settings');
                return;
            }
        }

        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(Boolean);
        const adminIndex = pathSegments.indexOf('admin');

        if (adminIndex !== -1 && pathSegments[adminIndex + 1]) {
            const tabFromUrl = pathSegments[adminIndex + 1];
            setActiveTab(tabFromUrl);
        } else {
            setActiveTab('dashboard');
        }
    }, [url, page.component]);

    return (
        <>
            <Head title={props.title ?? name} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} adminName={auth.user.name} adminRole={auth.user.role} />

                <div className="relative flex flex-1">
                    {/* Mobile Overlay */}
                    {sidebarOpen && <div className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden" onClick={() => setSidebarOpen(false)} />}

                    {/* Sidebar */}
                    <AdminSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        adminName={auth.user.name}
                        adminRole={auth.user.role}
                    />

                    {/* Main Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="min-w-0 flex-1 overflow-auto"
                        >
                            <main className="min-w-0 flex-1 overflow-auto">
                                <div className="p-3 sm:p-4 lg:p-6">{props.children}</div>
                            </main>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
