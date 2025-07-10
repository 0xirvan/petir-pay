import AppHeader from '@/components/app-header';
import LandingFooter from '@/components/landing-footer';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout(props: AppLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <>
            <Head title={props.title ?? name} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                <AppHeader />

                <main className="flex-1">{props.children}</main>

                <LandingFooter />
            </div>
        </>
    );
}
