<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use App\Models\Penggunaan;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Tarif;
use App\Models\MetodePembayaran;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class RealisticDataSeeder extends Seeder
{
    private $faker;
    private $tarifData;
    private $metodePembayaran;

    public function __construct()
    {
        $this->faker = Faker::create('id_ID'); // Indonesian locale
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting realistic data seeding...');

        // Clear existing data in correct order
        $this->clearExistingData();

        // Cache tarif and metode pembayaran data
        $this->tarifData = Tarif::all();
        $this->metodePembayaran = MetodePembayaran::all();

        if ($this->tarifData->isEmpty() || $this->metodePembayaran->isEmpty()) {
            $this->command->error('Please run TarifSeeder and MetodePembayaranSeeder first!');
            return;
        }

        // Generate more realistic pelanggan
        $this->command->info('Creating pelanggan...');
        $pelangganIds = $this->createPelanggan(50); // 50 pelanggan

        // Generate historical data for the last 24 months
        $this->command->info('Creating historical penggunaan and tagihan...');
        $this->createHistoricalData($pelangganIds, 24);

        // Generate pembayaran for paid tagihan
        $this->command->info('Creating pembayaran records...');
        $this->createPembayaran();

        $this->command->info('Realistic data seeding completed successfully!');
        $this->printStatistics();
    }

    private function clearExistingData(): void
    {
        $this->command->info('Clearing existing data...');

        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Pembayaran::truncate();
        Tagihan::truncate();
        Penggunaan::truncate();
        Pelanggan::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    private function createPelanggan(int $count): array
    {
        $pelangganIds = [];
        $indonesianCities = [
            'Jakarta Pusat',
            'Jakarta Selatan',
            'Jakarta Barat',
            'Jakarta Timur',
            'Jakarta Utara',
            'Bandung',
            'Surabaya',
            'Medan',
            'Semarang',
            'Makassar',
            'Palembang',
            'Tangerang',
            'Depok',
            'Bekasi',
            'Bogor',
            'Yogyakarta',
            'Malang',
            'Solo',
            'Denpasar',
            'Pontianak'
        ];

        $streetTypes = ['Jl.', 'Jalan', 'Gang', 'Komplek'];
        $streetNames = [
            'Merdeka',
            'Sudirman',
            'Thamrin',
            'Gatot Subroto',
            'Kuningan',
            'Menteng',
            'Kemang',
            'Senayan',
            'Cikini',
            'Tebet',
            'Kelapa Gading',
            'Pondok Indah',
            'Kebayoran',
            'Cilandak',
            'Fatmawati',
            'Blok M',
            'Matraman',
            'Cempaka Putih'
        ];

        for ($i = 0; $i < $count; $i++) {
            $tarif = $this->tarifData->random();

            // Generate realistic Indonesian names
            $firstName = $this->faker->firstName;
            $lastName = $this->faker->lastName;
            $name = $firstName . ' ' . $lastName;

            $email = strtolower(str_replace(' ', '.', $name)) . '@email.com';

            // Generate realistic address
            $streetType = $this->faker->randomElement($streetTypes);
            $streetName = $this->faker->randomElement($streetNames);
            $number = $this->faker->numberBetween(1, 999);
            $city = $this->faker->randomElement($indonesianCities);
            $address = "{$streetType} {$streetName} No. {$number}, {$city}";

            // Generate meter number
            $meterNumber = 'MTR' . str_pad($i + 1, 12, '0', STR_PAD_LEFT);

            $pelanggan = Pelanggan::create([
                'nama' => $name,
                'email' => $email,
                'password' => Hash::make('password123'),
                'alamat' => $address,
                'nomor_meter' => $meterNumber,
                'id_tarif' => $tarif->id,
            ]);

            $pelangganIds[] = $pelanggan->id;
        }

        return $pelangganIds;
    }

    private function createHistoricalData(array $pelangganIds, int $months): void
    {
        foreach ($pelangganIds as $pelangganId) {
            $pelanggan = Pelanggan::with('tarif')->find($pelangganId);
            $baseUsage = $this->getBaseUsageForTarif($pelanggan->tarif->daya);
            $currentMeterReading = $this->faker->numberBetween(1000, 5000);

            for ($monthOffset = $months - 1; $monthOffset >= 0; $monthOffset--) {
                $targetDate = Carbon::now()->subMonths($monthOffset);
                $bulan = $targetDate->month;
                $tahun = $targetDate->year;

                // Generate realistic usage with seasonal variation
                $usage = $this->generateRealisticUsage($baseUsage, $bulan, $monthOffset);
                $meterAwal = $currentMeterReading;
                $meterAkhir = $meterAwal + $usage;
                $currentMeterReading = $meterAkhir;

                // Create penggunaan
                $penggunaan = Penggunaan::create([
                    'id_pelanggan' => $pelangganId,
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                    'meter_awal' => $meterAwal,
                    'meter_akhir' => $meterAkhir,
                    'created_at' => $targetDate->copy()->addDays(rand(1, 5)),
                    'updated_at' => $targetDate->copy()->addDays(rand(1, 5)),
                ]);

                // Determine status based on month age and some randomness
                $status = $this->determineRealisticStatus($monthOffset);
                $tanggalBayar = null;

                if ($status === 'lunas') {
                    // Payment usually happens 5-30 days after month end
                    $tanggalBayar = $targetDate->copy()->endOfMonth()->addDays(rand(5, 30));
                    if ($tanggalBayar->isFuture()) {
                        $tanggalBayar = Carbon::now()->subDays(rand(1, 7));
                    }
                }

                // Create tagihan
                Tagihan::create([
                    'id_pelanggan' => $pelangganId,
                    'id_penggunaan' => $penggunaan->id,
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                    'jumlah_meter' => $usage,
                    'status' => $status,
                    'tanggal_bayar' => $tanggalBayar,
                    'created_at' => $targetDate->copy()->addDays(rand(25, 31)), // Bills created end of month
                    'updated_at' => $tanggalBayar ?? $targetDate->copy()->addDays(rand(25, 31)),
                ]);
            }
        }
    }

    private function createPembayaran(): void
    {
        $paidTagihan = Tagihan::where('status', 'lunas')
            ->with(['pelanggan.tarif'])
            ->get();

        // Get a random admin user for processing payments
        $adminUser = \App\Models\User::whereIn('role', ['admin', 'administrator', 'petugas'])->first();
        if (!$adminUser) {
            $this->command->warn('No admin user found. Payments will not be created.');
            return;
        }

        foreach ($paidTagihan as $tagihan) {
            $tarif = $tagihan->pelanggan->tarif;
            $biayaAdmin = 2500; // Standard admin fee
            $totalBayar = ($tagihan->jumlah_meter * $tarif->tarif_per_kwh) + $biayaAdmin;

            // Some payments might have slight variations (discounts, late fees, etc.)
            if ($this->faker->boolean(10)) { // 10% chance of variation
                $variation = $this->faker->randomFloat(0, -500, 1000);
                $totalBayar += $variation;
            }

            Pembayaran::create([
                'id_tagihan' => $tagihan->id,
                'id_pelanggan' => $tagihan->id_pelanggan,
                'id_metode_pembayaran' => $this->metodePembayaran->random()->id,
                'tanggal_pembayaran' => $tagihan->tanggal_bayar,
                'bulan_bayar' => $tagihan->bulan,
                'total_bayar' => max(0, $totalBayar), // Ensure non-negative
                'id_user' => $adminUser->id,
                'created_at' => $tagihan->tanggal_bayar,
                'updated_at' => $tagihan->tanggal_bayar,
            ]);
        }
    }

    private function getBaseUsageForTarif(int $daya): int
    {
        return match (true) {
            $daya <= 450 => rand(60, 150),    // Small households
            $daya <= 900 => rand(120, 280),   // Medium households
            $daya <= 1300 => rand(250, 450),  // Large households
            $daya <= 2200 => rand(400, 700),  // Large households with high consumption
            default => rand(600, 1000),       // Commercial/very large
        };
    }

    private function generateRealisticUsage(int $baseUsage, int $month, int $monthOffset): int
    {
        // Seasonal variation (Indonesia has wet and dry seasons)
        $seasonalMultiplier = match ($month) {
            4, 5, 6, 7, 8, 9, 10 => rand(115, 135) / 100, // Dry season (more AC usage)
            11, 12, 1, 2, 3 => rand(85, 105) / 100,       // Wet season (less AC)
            default => 1.0,
        };

        // Special months (holidays, etc.)
        $specialMultiplier = match ($month) {
            12 => rand(110, 125) / 100, // December - holiday season
            6, 7 => rand(105, 120) / 100, // June-July - school holidays
            default => 1.0,
        };

        // Random household variation
        $randomMultiplier = rand(80, 120) / 100;

        // Slight trend over time (increasing usage as appliances age/more devices)
        $trendMultiplier = 1 + ($monthOffset * 0.002); // 0.2% increase per month back

        $finalUsage = $baseUsage * $seasonalMultiplier * $specialMultiplier * $randomMultiplier * $trendMultiplier;

        return max(10, (int) round($finalUsage)); // Minimum 10 kWh
    }

    private function determineRealisticStatus(int $monthOffset): string
    {
        // More realistic distribution based on Indonesian payment patterns
        return match (true) {
            $monthOffset >= 6 => 'lunas', // Old bills are mostly paid
            $monthOffset >= 3 => $this->weightedRandom([
                'lunas' => 90,
                'belum_bayar' => 10
            ]),
            $monthOffset === 2 => $this->weightedRandom([
                'lunas' => 85,
                'belum_bayar' => 15
            ]),
            $monthOffset === 1 => $this->weightedRandom([
                'lunas' => 70,
                'menunggu_konfirmasi' => 10,
                'belum_bayar' => 20
            ]),
            $monthOffset === 0 => $this->weightedRandom([
                'lunas' => 40,
                'menunggu_konfirmasi' => 20,
                'belum_bayar' => 40
            ]),
            default => 'belum_bayar',
        };
    }

    private function weightedRandom(array $weights): string
    {
        $random = rand(1, 100);
        $cumulative = 0;

        foreach ($weights as $option => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $option;
            }
        }

        return array_key_first($weights);
    }

    private function printStatistics(): void
    {
        $pelangganCount = Pelanggan::count();
        $penggunaanCount = Penggunaan::count();
        $tagihanCount = Tagihan::count();
        $pembayaranCount = Pembayaran::count();

        $tagihanStats = Tagihan::selectRaw('
            status,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tagihan), 1) as percentage
        ')->groupBy('status')->get();

        $totalPendapatan = Tagihan::where('status', 'lunas')
            ->join('pelanggan', 'tagihan.id_pelanggan', '=', 'pelanggan.id')
            ->join('tarif', 'pelanggan.id_tarif', '=', 'tarif.id')
            ->selectRaw('SUM(tagihan.jumlah_meter * tarif.tarif_per_kwh + 2500) as total')
            ->value('total');

        $this->command->info("=== Seeding Statistics ===");
        $this->command->info("Pelanggan created: {$pelangganCount}");
        $this->command->info("Penggunaan records: {$penggunaanCount}");
        $this->command->info("Tagihan records: {$tagihanCount}");
        $this->command->info("Pembayaran records: {$pembayaranCount}");
        $this->command->info("Total pendapatan: Rp " . number_format($totalPendapatan, 0, ',', '.'));

        $this->command->info("\n=== Tagihan Status Distribution ===");
        foreach ($tagihanStats as $stat) {
            $this->command->info("{$stat->status}: {$stat->count} ({$stat->percentage}%)");
        }
    }
}
