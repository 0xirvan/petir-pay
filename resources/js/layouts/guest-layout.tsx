import LandingFooter from '@/components/landing-footer';
import LandingHeader from '@/components/landing-header';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';

interface GuestLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function GuestLayout(props: GuestLayoutProps) {
    const { name, url } = usePage<SharedData>().props;

    return (
        <>
            <Head title={props.title ?? name} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                <LandingHeader />

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
