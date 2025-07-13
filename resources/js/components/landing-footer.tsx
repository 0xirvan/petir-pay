import { Zap } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer id="kontak" className="bg-gray-900 py-12 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <div className="mb-4 flex items-center space-x-2">
                            <Zap className="h-8 w-8 text-blue-400" />
                            <span className="text-2xl font-bold">PetirPay</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Solusi pembayaran listrik pascabayar terpercaya dan terdepan di Indonesia.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Layanan</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="cursor-pointer transition-colors hover:text-blue-400">Pembayaran Listrik</li>
                            <li className="cursor-pointer transition-colors hover:text-blue-400">Cek Tagihan</li>
                            <li className="cursor-pointer transition-colors hover:text-blue-400">Riwayat Pembayaran</li>
                            <li className="cursor-pointer transition-colors hover:text-blue-400">Notifikasi Otomatis</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Dukungan</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="cursor-pointer transition-colors hover:text-blue-400">Pusat Bantuan</li>
                            <li className="cursor-pointer transition-colors hover:text-blue-400">Hubungi Kami</li>
                            <li className="flex items-center space-x-2">
                                <span>WhatsApp:</span>
                                <a href="https://wa.me/6281112345678" className="text-blue-400 transition-colors hover:text-blue-300">
                                    0811-1234-5678
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span>Email:</span>
                                <a href="mailto:support@petirpay.id" className="text-blue-400 transition-colors hover:text-blue-300">
                                    support@petirpay.id
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-6 md:flex-row">
                    <p className="text-sm text-gray-400">&copy; 2024 PetirPay. Semua hak dilindungi undang-undang.</p>
                    <div className="mt-4 flex space-x-6 md:mt-0">
                        <a className="text-sm text-gray-400 transition-colors hover:text-blue-400">Kebijakan Privasi</a>
                        <a className="text-sm text-gray-400 transition-colors hover:text-blue-400">Syarat & Ketentuan</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
