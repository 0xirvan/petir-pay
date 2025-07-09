import LandingFooter from '@/components/landing-footer';
import LandingHeader from '@/components/landing-header';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface GuestLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function GuestLayout(props: GuestLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <>
            <Head title={props.title ?? name} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <LandingHeader />

                <main>{props.children}</main>

                <LandingFooter />
            </div>
        </>
    );
}
