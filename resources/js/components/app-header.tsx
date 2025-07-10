import { Link, router } from '@inertiajs/react';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { scroller } from 'react-scroll';
import { Button } from './ui/button';

export default function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMobileMenuClick = () => {
        setIsMenuOpen(false);
    };

    const navigateToHomeSection = (sectionId: string) => {
        router.visit(route('home'), {
            onSuccess: () => {
                setTimeout(() => {
                    scroller.scrollTo(sectionId, {
                        duration: 800,
                        smooth: true,
                        offset: -80,
                    });
                }, 100);
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link className="flex cursor-pointer items-center space-x-3" href={route('home')}>
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
                        </div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent">
                                PetirPay
                            </span>
                            <div className="-mt-1 text-xs text-gray-500">Trusted Payment</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 lg:flex">
                        <button
                            onClick={() => navigateToHomeSection('fitur')}
                            className="group relative cursor-pointer font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                        >
                            Fitur
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                        </button>
                        <button
                            onClick={() => navigateToHomeSection('cara-kerja')}
                            className="group relative cursor-pointer font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                        >
                            Cara Kerja
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                        </button>
                        <button
                            onClick={() => navigateToHomeSection('kontak')}
                            className="group relative cursor-pointer font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                        >
                            Kontak
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                        </button>
                        <Link
                            href={route('cek-tarif')}
                            className="group relative cursor-pointer font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                        >
                            Cek Tarif
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                        </Link>
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden items-center space-x-3 lg:flex">
                        <div></div>
                        <Link href={route('pelanggan.login')}>
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl">
                                Mulai Sekarang
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 lg:hidden"
                    >
                        {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`transition-all duration-300 ease-in-out lg:hidden ${
                        isMenuOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                    }`}
                >
                    <div className="border-t border-gray-100 pt-4">
                        <nav className="flex flex-col space-y-4">
                            <button
                                onClick={() => {
                                    navigateToHomeSection('fitur');
                                    handleMobileMenuClick();
                                }}
                                className="cursor-pointer rounded-lg px-4 py-2 text-left font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Fitur
                            </button>
                            <button
                                onClick={() => {
                                    navigateToHomeSection('cara-kerja');
                                    handleMobileMenuClick();
                                }}
                                className="cursor-pointer rounded-lg px-4 py-2 text-left font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Cara Kerja
                            </button>

                            <button
                                onClick={() => {
                                    navigateToHomeSection('kontak');
                                    handleMobileMenuClick();
                                }}
                                className="cursor-pointer rounded-lg px-4 py-2 text-left font-medium text-gray-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                                Kontak
                            </button>
                            <Link
                                href={route('cek-tarif')}
                                className="group relative cursor-pointer font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                            >
                                Cek Tarif
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                            </Link>
                            <div className="flex flex-col space-y-3 border-t border-gray-100 pt-4">
                                <Link href={route('pelanggan.login')}>
                                    <Button className="w-full justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800">
                                        Mulai Sekarang
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
