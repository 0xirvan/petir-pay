import { Tabs } from '@/components/ui/tabs';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Import components from the dashboard module
import {
    BayarTab,
    DashboardProps,
    Header,
    OverviewTab,
    QuickStats,
    RiwayatTab,
    SuccessAlert,
    TabNavigation,
    WelcomeSection,
} from '@/components/pelanggan/dashboard';

export default function Dashboard({ pelanggan, currentBill, riwayatTagihan, riwayatPembayaran, metodePembayaran, statusDashboard }: DashboardProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string; redirect_to_history?: boolean };

    // Handle redirect to history tab after successful payment
    useEffect(() => {
        if (flash.redirect_to_history) {
            setActiveTab('riwayat');
        }
    }, [flash.redirect_to_history]);

    const handlePaymentSuccess = () => {
        setActiveTab('riwayat');
    };

    return (
        <>
            <Head title="Dashboard Pelanggan" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Success Alert */}
                <SuccessAlert />

                {/* Header */}
                <Header pelanggan={pelanggan} />

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <WelcomeSection pelanggan={pelanggan} />

                    {/* Quick Stats */}
                    <QuickStats pelanggan={pelanggan} currentBill={currentBill} statusDashboard={statusDashboard} />

                    {/* Main Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabNavigation activeTab={activeTab} />

                        {/* Overview Tab */}
                        <OverviewTab pelanggan={pelanggan} currentBill={currentBill} onBayarClick={() => setActiveTab('bayar')} />

                        {/* Bayar Tagihan Tab */}
                        <BayarTab currentBill={currentBill} metodePembayaran={metodePembayaran} onPaymentSuccess={handlePaymentSuccess} />

                        {/* Riwayat Tab */}
                        <RiwayatTab riwayatTagihan={riwayatTagihan} riwayatPembayaran={riwayatPembayaran} />
                    </Tabs>
                </div>
            </div>
        </>
    );
}
