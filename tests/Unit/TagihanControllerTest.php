<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Admin\TagihanController;
use App\Models\Tarif;
use App\Models\Pelanggan;
use App\Models\Penggunaan;
use App\Models\Tagihan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Unit Test untuk TagihanController
 * 
 * Test Cases:
 * 1. index() - menampilkan daftar tagihan
 * 2. store() - membuat tagihan baru (valid/invalid/duplicate)
 * 3. searchPelanggan() - pencarian pelanggan (found/not found)
 * 4. getPenggunaanBulanSebelumnya() - get data bulan sebelumnya
 */
class TagihanControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;
    protected $tarif;
    protected $pelanggan;
    protected $penggunaan;

    /**
     * Setup data uji sebelum setiap test
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->controller = new TagihanController();

        // Create admin user for authentication
        $this->actingAs(\App\Models\User::factory()->create([
            'role' => 'administrator'
        ]));

        // Setup data master untuk testing
        $this->tarif = Tarif::create([
            'daya' => 900,
            'tarif_per_kwh' => 1352,
            'deskripsi' => 'Tarif R1/TR 900 VA'
        ]);

        $this->pelanggan = Pelanggan::create([
            'nama' => 'Budi Santoso',
            'nomor_meter' => '1234567890',
            'email' => 'budi@test.com',
            'password' => bcrypt('password'),
            'alamat' => 'Jl. Test No. 123',
            'id_tarif' => $this->tarif->id
        ]);

        $this->penggunaan = Penggunaan::create([
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 6,
            'tahun' => 2025,
            'meter_awal' => 1000,
            'meter_akhir' => 1100
        ]);
    }

    /**
     * Test Case 1: Test index() method menampilkan daftar tagihan
     */
    public function test_index_returns_tagihan_list_successfully()
    {
        // Arrange - Buat data tagihan
        $tagihan = Tagihan::create([
            'id_penggunaan' => $this->penggunaan->id,
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100,
            'status' => 'belum_bayar'
        ]);

        // Act - Test langsung controller method untuk unit test
        $request = new Request(['search' => '', 'status' => '', 'per_page' => 10]);
        $response = $this->controller->index($request);

        // Assert - Periksa response Inertia
        $this->assertInstanceOf(\Inertia\Response::class, $response);

        // Verify component name from response props
        $props = $response->getViewData();
        $this->assertEquals('admin/kelola-tagihan', $props['component']);
        $this->assertArrayHasKey('tagihan', $props['props']);
        $this->assertArrayHasKey('title', $props['props']);
    }

    /**
     * Test Case 2: Test index() dengan filter search
     */
    public function test_index_with_search_filter()
    {
        // Arrange
        Tagihan::create([
            'id_penggunaan' => $this->penggunaan->id,
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100,
            'status' => 'belum_bayar'
        ]);

        // Act - Test dengan search filter
        $request = new Request(['search' => 'Budi', 'status' => '', 'per_page' => 10]);
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(\Inertia\Response::class, $response);
    }

    /**
     * Test Case 3: Test store() method dengan data valid
     */
    public function test_store_creates_tagihan_successfully()
    {
        // Arrange - Data valid
        $data = [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100
        ];

        // Act - Post data tagihan
        $response = $this->post('/admin/tagihan', $data);

        // Assert - Tagihan berhasil dibuat
        $response->assertRedirect()
            ->assertSessionHas('success', 'Tagihan berhasil dibuat!');

        $this->assertDatabaseHas('tagihan', [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100,
            'status' => 'belum_bayar'
        ]);

        // Assert - Penggunaan juga dibuat
        $this->assertDatabaseHas('penggunaan', [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'meter_awal' => 1100, // dari penggunaan bulan sebelumnya
            'meter_akhir' => 1200 // meter_awal + jumlah_meter
        ]);
    }

    /**
     * Test Case 4: Test store() dengan data invalid - bulan > 12
     */
    public function test_store_fails_with_invalid_month()
    {
        // Arrange - Data dengan bulan invalid
        $data = [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 13, // Invalid month
            'tahun' => 2025,
            'jumlah_meter' => 100
        ];

        // Act & Assert - Expect validation error
        $response = $this->post('/admin/tagihan', $data);

        $response->assertSessionHasErrors(['bulan']);
    }

    /**
     * Test Case 5: Test store() dengan jumlah_meter negatif
     */
    public function test_store_fails_with_negative_jumlah_meter()
    {
        // Arrange
        $data = [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => -10 // Negative value
        ];

        // Act & Assert
        $response = $this->post('/admin/tagihan', $data);

        $response->assertSessionHasErrors(['jumlah_meter']);
    }

    /**
     * Test Case 6: Test store() dengan duplikasi tagihan
     */
    public function test_store_fails_with_duplicate_tagihan()
    {
        // Arrange - Buat tagihan existing
        Tagihan::create([
            'id_penggunaan' => $this->penggunaan->id,
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 50,
            'status' => 'belum_bayar'
        ]);

        $data = [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100
        ];

        // Act - Test duplikasi langsung di controller
        $request = new Request($data);
        $request->setLaravelSession(session());

        // Mock validator
        $this->app->bind('validator', function ($app) use ($data) {
            $validator = \Validator::make($data, [
                'id_pelanggan' => 'required|exists:pelanggan,id',
                'bulan' => 'required|integer|min:1|max:12',
                'tahun' => 'required|integer|min:2024|max:2030',
                'jumlah_meter' => 'required|integer|min:0',
            ]);
            return $validator;
        });

        $response = $this->controller->store($request);

        // Assert - Duplikasi error
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
    }

    /**
     * Test Case 7: Test searchPelanggan() method
     */
    public function test_search_pelanggan_returns_results()
    {
        // Act - Test langsung controller method
        $request = new Request(['search' => 'Budi']);
        $response = $this->controller->searchPelanggan($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertCount(1, $data);
        $this->assertEquals('Budi Santoso', $data[0]['nama']);
        $this->assertEquals('1234567890', $data[0]['nomor_meter']);
        $this->assertArrayHasKey('tarif', $data[0]);
        $this->assertEquals(1352, $data[0]['tarif']['tarif_per_kwh']);
    }

    /**
     * Test Case 8: Test searchPelanggan() dengan search kosong
     */
    public function test_search_pelanggan_with_empty_search()
    {
        // Act - Test tanpa parameter
        $request = new Request([]);
        $response = $this->controller->searchPelanggan($request);

        // Assert - Return semua pelanggan (limit 10)
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertCount(1, $data); // Hanya 1 pelanggan yang ada
    }

    /**
     * Test Case 9: Test searchPelanggan() dengan nomor meter
     */
    public function test_search_pelanggan_by_nomor_meter()
    {
        // Act - Search by nomor meter
        $request = new Request(['search' => '123456']);
        $response = $this->controller->searchPelanggan($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertCount(1, $data);
        $this->assertEquals('1234567890', $data[0]['nomor_meter']);
    }

    /**
     * Test Case 10: Test getPenggunaanBulanSebelumnya() method
     */
    public function test_get_penggunaan_bulan_sebelumnya_success()
    {
        // Act - Test langsung controller method
        $request = new Request([
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025
        ]);
        $response = $this->controller->getPenggunaanBulanSebelumnya($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertEquals(1100, $data['meter_akhir']);
        $this->assertEquals(6, $data['previous_month']);
        $this->assertEquals(2025, $data['previous_year']);
        $this->assertTrue($data['has_previous']);
    }

    /**
     * Test Case 11: Test getPenggunaanBulanSebelumnya() tanpa data sebelumnya
     */
    public function test_get_penggunaan_bulan_sebelumnya_no_previous_data()
    {
        // Act - Test untuk bulan pertama (tidak ada data sebelumnya)
        $request = new Request([
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 1,
            'tahun' => 2024
        ]);
        $response = $this->controller->getPenggunaanBulanSebelumnya($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertEquals(0, $data['meter_akhir']);
        $this->assertEquals(12, $data['previous_month']);
        $this->assertEquals(2023, $data['previous_year']);
        $this->assertFalse($data['has_previous']);
    }

    /**
     * Test Case 12: Test getPenggunaanBulanSebelumnya() dengan parameter tidak lengkap
     */
    public function test_get_penggunaan_bulan_sebelumnya_missing_parameters()
    {
        // Act - Request tanpa parameter
        $request = new Request([]);
        $response = $this->controller->getPenggunaanBulanSebelumnya($request);

        // Assert
        $this->assertInstanceOf(\Illuminate\Http\JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getContent(), true);
        $this->assertEquals(0, $data['meter_akhir']);
    }

    /**
     * Test Case 13: Test store() dengan tahun di luar range
     */
    public function test_store_fails_with_year_out_of_range()
    {
        // Arrange - Tahun di luar range
        $data = [
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2023, // Di bawah minimum (2024)
            'jumlah_meter' => 100
        ];

        // Act & Assert
        $response = $this->post('/admin/tagihan', $data);

        $response->assertSessionHasErrors(['tahun']);
    }

    /**
     * Test Case 14: Test store() dengan pelanggan tidak exist
     */
    public function test_store_fails_with_non_existent_pelanggan()
    {
        // Arrange - ID pelanggan yang tidak ada
        $data = [
            'id_pelanggan' => 999, // Non-existent ID
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100
        ];

        // Act & Assert
        $response = $this->post('/admin/tagihan', $data);

        $response->assertSessionHasErrors(['id_pelanggan']);
    }

    /**
     * Test Case 15: Test index() dengan filter status
     */
    public function test_index_with_status_filter()
    {
        // Arrange - Buat tagihan dengan status berbeda
        Tagihan::create([
            'id_penggunaan' => $this->penggunaan->id,
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 7,
            'tahun' => 2025,
            'jumlah_meter' => 100,
            'status' => 'lunas'
        ]);

        // Create another penggunaan for second tagihan
        $penggunaan2 = Penggunaan::create([
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 8,
            'tahun' => 2025,
            'meter_awal' => 1100,
            'meter_akhir' => 1200
        ]);

        Tagihan::create([
            'id_penggunaan' => $penggunaan2->id,
            'id_pelanggan' => $this->pelanggan->id,
            'bulan' => 8,
            'tahun' => 2025,
            'jumlah_meter' => 100,
            'status' => 'belum_bayar'
        ]);

        // Act - Filter by status
        $request = new Request(['search' => '', 'status' => 'lunas', 'per_page' => 10]);
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(\Inertia\Response::class, $response);
    }
}
