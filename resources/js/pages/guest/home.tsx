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

            {/* Contact Section */}
            <section id="kontak" className="bg-white py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900">Hubungi Kami</h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">
                            Tim customer service kami siap membantu Anda 24/7. Hubungi kami melalui saluran yang tersedia.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Phone Support */}
                        <div className="rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Customer Service</h3>
                            <p className="mb-4 text-gray-600">Layanan 24/7</p>
                            <a href="tel:+6281112345678" className="text-lg font-semibold text-blue-600 transition-colors hover:text-blue-700">
                                0811-1234-5678
                            </a>
                        </div>

                        {/* WhatsApp */}
                        <div className="rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">WhatsApp</h3>
                            <p className="mb-4 text-gray-600">Chat Langsung</p>
                            <a
                                href="https://wa.me/6281112345678"
                                className="text-lg font-semibold text-green-600 transition-colors hover:text-green-700"
                            >
                                Chat Sekarang
                            </a>
                        </div>

                        {/* Email */}
                        <div className="rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Email Support</h3>
                            <p className="mb-4 text-gray-600">Respon &lt; 2 jam</p>
                            <a
                                href="mailto:support@listrikpay.id"
                                className="text-lg font-semibold text-purple-600 transition-colors hover:text-purple-700"
                            >
                                support@listrikpay.id
                            </a>
                        </div>

                        {/* Office */}
                        <div className="rounded-2xl bg-gray-50 p-8 text-center transition-shadow hover:shadow-lg">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900">Kantor Pusat</h3>
                            <p className="mb-4 text-gray-600">Jakarta Pusat</p>
                            <p className="font-medium text-gray-700">
                                Jl. Sudirman No. 123
                                <br />
                                Jakarta 10220
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
