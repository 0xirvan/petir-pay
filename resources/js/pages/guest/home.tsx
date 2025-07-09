import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ArrowRight, Badge, Star, Users } from 'lucide-react';

export default function Home() {
    return (
        <GuestLayout title="Beranda">
            {/* Hero Section */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <Badge className="mb-4 bg-blue-100 text-blue-800">Pembayaran Listrik Terpercaya</Badge>
                            <h1 className="mb-6 text-5xl font-bold text-gray-900">
                                Bayar Listrik Pascabayar
                                <span className="text-blue-600"> Mudah & Cepat</span>
                            </h1>
                            <p className="mb-8 text-xl text-gray-600">
                                Nikmati kemudahan pembayaran tagihan listrik pascabayar dengan sekali klik. Aman, cepat, dan tersedia 24/7 untuk
                                kemudahan Anda.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    Mulai Bayar Sekarang
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <div></div>
                            </div>
                            <div className="mt-8 flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <span className="text-gray-600">500K+ Pengguna</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-gray-600">4.8/5 Rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="scale-150 transform">
                                <DotLottieReact src="/video/intro.lottie" loop autoplay />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
