import LandingCard from '@/components/landing-card';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/layouts/guest-layout';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ArrowRight, Badge, Bell, Clock, CreditCard, Shield, Smartphone, Star, Users, Zap } from 'lucide-react';

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

            {/* Features Section */}
            <section id="fitur" className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">Mengapa Pilih PetirPay?</h2>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600">
                            Kami menyediakan solusi pembayaran listrik yang aman, cepat, dan mudah digunakan
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <LandingCard
                            title="Pembayaran Instan"
                            description="Tagihan listrik terbayar dalam hitungan detik dengan konfirmasi real-time"
                            icon={<Zap className="h-6 w-6 text-blue-600" />}
                            color="blue"
                        />

                        <LandingCard
                            title="Keamanan Terjamin"
                            description="Transaksi aman dengan enkripsi tingkat tinggi dan perlindungan data pribadi"
                            icon={<Shield className="h-6 w-6 text-green-600" />}
                            color="green"
                        />

                        <LandingCard
                            title="24/7 Tersedia"
                            description="Tagihan listrik terbayar dalam hitungan detik dengan konfirmasi real-time"
                            icon={<Clock className="h-6 w-6 text-purple-600" />}
                            color="purple"
                        />

                        <LandingCard
                            title="Multi Platform"
                            description="Akses melalui website, aplikasi mobile iOS & Android (dalam pengembangan)"
                            icon={<Smartphone className="h-6 w-6 text-orange-600" />}
                            color="orange"
                        />

                        <LandingCard
                            title="Metode Pembayaran Lengkap"
                            description="Dukungan berbagai metode pembayaran seperti transfer bank dan e-wallet"
                            icon={<CreditCard className="h-6 w-6 text-red-600" />}
                            color="red"
                        />

                        <LandingCard
                            title="Notifikasi Otomatis"
                            description="Pengingat tagihan dan konfirmasi pembayaran langsung ke WhatsApp & email"
                            icon={<Bell className="h-6 w-6 text-yellow-600" />}
                            color="yellow"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="cara-kerja" className="bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">Cara Kerja Sangat Mudah</h2>
                        <p className="text-xl text-gray-600">Hanya 3 langkah untuk membayar tagihan listrik Anda</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Lakukan Registrasi</h3>
                            <p className="text-gray-600">Daftar dan buat akun dengan mudah untuk mulai menggunakan layanan kami</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Pilih Metode Pembayaran</h3>
                            <p className="text-gray-600">Pilih dari berbagai metode pembayaran yang tersedia sesuai preferensi Anda</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Konfirmasi & Selesai</h3>
                            <p className="text-gray-600">Konfirmasi pembayaran dan terima bukti pembayaran digital secara instan</p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
