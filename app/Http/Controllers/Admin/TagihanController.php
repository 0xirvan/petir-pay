<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use App\Models\Penggunaan;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;


/**
 * TagihanController
 * 
 * Mengelola proses pembuatan, pencarian, dan pelaporan tagihan pelanggan listrik.
 * 
 * Daftar Method:
 * 
 * - index(Request $request)
 *     Menampilkan daftar tagihan dengan fitur pencarian, filter status, dan paginasi.
 *     Juga menampilkan statistik jumlah tagihan berdasarkan status.
 *     Parameter: 
 *         - search (opsional): kata kunci pencarian nama pelanggan/nomor meter
 *         - status (opsional): filter status tagihan
 *         - per_page (opsional): jumlah data per halaman
 *     Return: Inertia view 'admin/kelola-tagihan' beserta data tagihan dan statistik.
 * 
 * - store(Request $request)
 *     Membuat tagihan baru untuk pelanggan pada periode tertentu.
 *     Melakukan validasi input, pengecekan duplikasi tagihan, dan pembuatan data penggunaan jika diperlukan.
 *     Parameter: 
 *         - id_pelanggan, bulan, tahun, jumlah_meter
 *     Return: Redirect back dengan pesan sukses atau error.
 * 
 * - searchPelanggan(Request $request)
 *     API endpoint untuk mencari data pelanggan berdasarkan nama, nomor meter, atau email.
 *     Parameter: 
 *         - search (opsional): kata kunci pencarian
 *     Return: JSON array data pelanggan beserta tarif.
 * 
 * - getPenggunaanBulanSebelumnya(Request $request)
 *     API endpoint untuk mendapatkan data penggunaan bulan sebelumnya dari pelanggan tertentu.
 *     Parameter: 
 *         - id_pelanggan, bulan, tahun
 *     Return: JSON data meter akhir bulan sebelumnya dan info periode.
 */


/**
 * Kemungkinan Eksepsi pada TagihanController:
 * 
 * 1. Validasi Gagal (ValidationException)
 *    - Pada method store(), jika input tidak sesuai aturan validasi (misal: id_pelanggan tidak ada, bulan/tahun/jumlah_meter tidak valid), maka akan terjadi ValidationException dan Laravel otomatis mengembalikan response error ke user.
 * 
 * 2. Duplikasi Data (Custom Error)
 *    - Pada method store(), jika tagihan untuk pelanggan dan periode yang sama sudah ada, maka proses akan dibatalkan dan user mendapat pesan error "Tagihan untuk periode ini sudah ada!".
 * 
 * 3. Data Tidak Ditemukan (ModelNotFoundException)
 *    - Pada method searchPelanggan() dan getPenggunaanBulanSebelumnya(), jika data pelanggan atau penggunaan tidak ditemukan, maka hasilnya akan null atau default (tidak terjadi exception fatal, hanya response data kosong).
 * 
 * 4. Request Parameter Tidak Lengkap
 *    - Pada getPenggunaanBulanSebelumnya(), jika parameter id_pelanggan, bulan, atau tahun tidak dikirim, maka response akan mengembalikan meter_akhir = 0 tanpa error fatal.
 * 
 * 5. Error Database/Server (QueryException, dll)
 *    - Jika terjadi masalah pada query database (misal: koneksi gagal, constraint error), Laravel akan melempar QueryException yang bisa ditangani oleh global exception handler.
 * 
 * 6. Error pada proses create penggunaan/tagihan
 *    - Jika terjadi error saat create data (misal: field tidak sesuai, constraint gagal), maka akan terjadi QueryException atau MassAssignmentException.
 * 
 * Penanganan:
 * - Validasi input sudah dilakukan dengan $request->validate().
 * - Error duplikasi tagihan ditangani dengan pengecekan manual dan pesan error ke user.
 * - Error lain akan ditangani oleh global exception handler Laravel.
 */

class TagihanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $perPage = $request->get('per_page', 10);

        $query = Tagihan::with(['pelanggan.tarif'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('pelanggan', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nomor_meter', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc');

        $tagihan = $query->paginate($perPage);

        return Inertia::render('admin/kelola-tagihan', [
            'title' => 'Kelola Tagihan',
            'tagihan' => $tagihan,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
            'stats' => [
                'total_tagihan' => Tagihan::count(),
                'total_belum_bayar' => Tagihan::where('status', 'belum_bayar')->count(),
                'total_menunggu_konfirmasi' => Tagihan::where('status', 'menunggu_konfirmasi')->count(),
                'total_lunas' => Tagihan::where('status', 'lunas')->count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_pelanggan' => 'required|exists:pelanggan,id',
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2024|max:2030',
            'jumlah_meter' => 'required|integer|min:0',
        ], [
            'id_pelanggan.required' => 'Pelanggan harus dipilih.',
            'id_pelanggan.exists' => 'Pelanggan tidak valid.',
            'bulan.required' => 'Bulan harus diisi.',
            'bulan.min' => 'Bulan minimal 1.',
            'bulan.max' => 'Bulan maksimal 12.',
            'tahun.required' => 'Tahun harus diisi.',
            'tahun.min' => 'Tahun minimal 2024.',
            'tahun.max' => 'Tahun maksimal 2030.',
            'jumlah_meter.required' => 'Pemakaian kWh harus diisi.',
            'jumlah_meter.min' => 'Pemakaian kWh tidak boleh negatif.',
        ]);

        // Check if tagihan already exists for this period
        $existingTagihan = Tagihan::where('id_pelanggan', $request->id_pelanggan)
            ->where('bulan', $request->bulan)
            ->where('tahun', $request->tahun)
            ->first();

        if ($existingTagihan) {
            return back()->with('error', 'Tagihan untuk periode ini sudah ada!');
        }

        // Create penggunaan record first (optional, could be null)
        $penggunaan = null;
        if ($request->jumlah_meter > 0) {
            // Get meter_akhir from previous month to use as meter_awal
            $previousMonth = $request->bulan - 1;
            $previousYear = $request->tahun;

            if ($previousMonth <= 0) {
                $previousMonth = 12;
                $previousYear = $request->tahun - 1;
            }

            $previousPenggunaan = Penggunaan::where('id_pelanggan', $request->id_pelanggan)
                ->where('bulan', $previousMonth)
                ->where('tahun', $previousYear)
                ->first();

            $meterAwal = $previousPenggunaan ? $previousPenggunaan->meter_akhir : 0;

            $penggunaan = Penggunaan::create([
                'id_pelanggan' => $request->id_pelanggan,
                'bulan' => $request->bulan,
                'tahun' => $request->tahun,
                'meter_awal' => $meterAwal,
                'meter_akhir' => $meterAwal + $request->jumlah_meter,
            ]);
        }

        $tagihan = Tagihan::create([
            'id_penggunaan' => $penggunaan ? $penggunaan->id : null,
            'id_pelanggan' => $request->id_pelanggan,
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'jumlah_meter' => $request->jumlah_meter,
            'status' => 'belum_bayar',
        ]);

        return back()->with([
            'success' => 'Tagihan berhasil dibuat!',
            'tagihanBaru' => $tagihan->load('pelanggan.tarif')
        ]);
    }

    // API endpoint untuk search pelanggan
    public function searchPelanggan(Request $request)
    {
        $search = $request->get('search', '');

        $pelanggan = Pelanggan::with('tarif')
            ->when($search, function ($query, $search) {
                return $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('nomor_meter', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama' => $p->nama,
                    'nomor_meter' => $p->nomor_meter,
                    'email' => $p->email,
                    'alamat' => $p->alamat,
                    'tarif' => $p->tarif ? [
                        'id' => $p->tarif->id,
                        'daya' => $p->tarif->daya,
                        'tarif_per_kwh' => $p->tarif->tarif_per_kwh,
                        'deskripsi' => $p->tarif->deskripsi,
                    ] : null,
                ];
            });

        return response()->json($pelanggan);
    }

    // API endpoint untuk get penggunaan bulan sebelumnya
    public function getPenggunaanBulanSebelumnya(Request $request)
    {
        $pelangganId = $request->get('id_pelanggan');
        $bulan = $request->get('bulan');
        $tahun = $request->get('tahun');

        if (!$pelangganId || !$bulan || !$tahun) {
            return response()->json(['meter_akhir' => 0]);
        }

        $previousMonth = $bulan - 1;
        $previousYear = $tahun;

        if ($previousMonth <= 0) {
            $previousMonth = 12;
            $previousYear = $tahun - 1;
        }

        $previousPenggunaan = Penggunaan::where('id_pelanggan', $pelangganId)
            ->where('bulan', $previousMonth)
            ->where('tahun', $previousYear)
            ->first();

        return response()->json([
            'meter_akhir' => $previousPenggunaan ? $previousPenggunaan->meter_akhir : 0,
            'previous_month' => $previousMonth,
            'previous_year' => $previousYear,
            'has_previous' => $previousPenggunaan ? true : false
        ]);
    }
}
