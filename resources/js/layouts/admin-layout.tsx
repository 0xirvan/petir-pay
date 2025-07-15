import AdminHeader from '@/components/admin-header';
import AdminSidebar from '@/components/admin-sidebar';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout(props: AdminLayoutProps) {
    const { name, url, auth, flash } = usePage<SharedData>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return (
        <>
            <Head title={props.title ?? name} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <AdminHeader
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    adminName={auth.user.name}
                    adminRole={auth.user.role}
                    adminPhoto={auth.user.photo_profile_url}
                />

                <div className="relative flex flex-1">
                    {/* Mobile Overlay */}
                    {sidebarOpen && <div className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden" onClick={() => setSidebarOpen(false)} />}

                    {/* Sidebar */}
                    <AdminSidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        adminName={auth.user.name}
                        adminRole={auth.user.role}
                        adminPhoto={auth.user.photo_profile_url}
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
