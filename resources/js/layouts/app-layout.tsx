import AppHeader from '@/components/app-header';
import LandingFooter from '@/components/landing-footer';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout(props: AppLayoutProps) {
    const { name, url } = usePage<SharedData>().props;

    return (
        <>
            <Head title={props.title ?? name} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                <AppHeader />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={url}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <main className="flex-1"> {props.children}</main>
                    </motion.div>
                </AnimatePresence>

                <LandingFooter />
            </div>
        </>
    );
}
