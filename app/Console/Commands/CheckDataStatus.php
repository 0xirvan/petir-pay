<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pelanggan;
use App\Models\Penggunaan;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Tarif;
use App\Models\MetodePembayaran;
use App\Models\User;

class CheckDataStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:status {--detailed : Show detailed breakdown}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check the status of seeded data in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("📊 Database Status Report");
        $this->info("=========================");

        // Basic counts
        $counts = [
            'Users (Admin/Petugas)' => User::count(),
            'Tarif' => Tarif::count(),
            'Metode Pembayaran' => MetodePembayaran::count(),
            'Pelanggan' => Pelanggan::count(),
            'Penggunaan' => Penggunaan::count(),
            'Tagihan' => Tagihan::count(),
            'Pembayaran' => Pembayaran::count(),
        ];

        foreach ($counts as $label => $count) {
            $this->line(sprintf("%-20s: %s", $label, number_format($count)));
        }

        if ($this->option('detailed')) {
            $this->showDetailedBreakdown();
        }

        $this->newLine();
        $this->info("Use --detailed flag for more information");
    }

    private function showDetailedBreakdown(): void
    {
        $this->newLine();
        $this->info("📈 Detailed Breakdown");
        $this->info("====================");

        // Tagihan status breakdown
        $tagihanStats = Tagihan::selectRaw('
            status,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tagihan), 1) as percentage
        ')->groupBy('status')->get();

        $this->line("\n🧾 Tagihan Status:");
        foreach ($tagihanStats as $stat) {
            $this->line("  {$stat->status}: {$stat->count} ({$stat->percentage}%)");
        }

        // Tarif usage breakdown
        $tarifStats = Pelanggan::join('tarif', 'pelanggan.id_tarif', '=', 'tarif.id')
            ->selectRaw('tarif.daya, COUNT(*) as count')
            ->groupBy('tarif.daya')
            ->orderBy('tarif.daya')
            ->get();

        $this->line("\n⚡ Pelanggan by Tarif:");
        foreach ($tarifStats as $stat) {
            $this->line("  {$stat->daya} VA: {$stat->count} pelanggan");
        }

        // Recent data
        $recentTagihan = Tagihan::orderBy('created_at', 'desc')->take(5)->get();
        $this->line("\n📅 Recent Tagihan:");
        foreach ($recentTagihan as $tagihan) {
            $this->line("  {$tagihan->bulan}/{$tagihan->tahun} - {$tagihan->status} - " . number_format($tagihan->jumlah_meter) . " kWh");
        }

        // Revenue calculation - gunakan data pembayaran untuk akurasi
        try {
            $totalPendapatan = Pembayaran::sum('total_bayar') ?? 0;

            // Jika tidak ada data pembayaran, fallback ke tagihan lunas
            if ($totalPendapatan == 0) {
                $totalPendapatan = Tagihan::where('status', 'lunas')
                    ->join('pelanggan', 'tagihan.id_pelanggan', '=', 'pelanggan.id')
                    ->join('tarif', 'pelanggan.id_tarif', '=', 'tarif.id')
                    ->selectRaw('SUM(tagihan.jumlah_meter * tarif.tarif_per_kwh + 2500) as total')
                    ->value('total') ?? 0;

                $this->line("\n💰 Total Pendapatan (dari tagihan): Rp " . number_format($totalPendapatan, 0, ',', '.'));
                $this->warn("   ⚠️  Menggunakan fallback karena tidak ada data pembayaran");
            } else {
                $this->line("\n💰 Total Pendapatan (dari pembayaran): Rp " . number_format($totalPendapatan, 0, ',', '.'));
            }

            // Breakdown pendapatan per metode pembayaran
            $pembayaranByMetode = Pembayaran::join('metode_pembayaran', 'pembayaran.id_metode_pembayaran', '=', 'metode_pembayaran.id')
                ->selectRaw('metode_pembayaran.nama, SUM(pembayaran.total_bayar) as total, COUNT(*) as count')
                ->groupBy('metode_pembayaran.id', 'metode_pembayaran.nama')
                ->orderBy('total', 'desc')
                ->get();

            if ($pembayaranByMetode->isNotEmpty()) {
                $this->line("\n💳 Pendapatan per Metode Pembayaran:");
                foreach ($pembayaranByMetode as $metode) {
                    $this->line("  {$metode->nama}: Rp " . number_format($metode->total, 0, ',', '.') . " ({$metode->count} transaksi)");
                }
            }

        } catch (\Exception $e) {
            $this->error("Error calculating revenue: " . $e->getMessage());
        }
    }
}
