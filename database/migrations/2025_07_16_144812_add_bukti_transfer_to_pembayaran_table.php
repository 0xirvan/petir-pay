<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->string('bukti_transfer')->nullable()->after('total_bayar');
            $table->enum('status_verifikasi', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu')->after('bukti_transfer');
            $table->text('catatan_verifikasi')->nullable()->after('status_verifikasi');
            $table->timestamp('tanggal_verifikasi')->nullable()->after('catatan_verifikasi');
            $table->foreignId('id_verifikator')->nullable()->constrained('users')->onDelete('set null')->after('tanggal_verifikasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pembayaran', function (Blueprint $table) {
            $table->dropForeign(['id_verifikator']);
            $table->dropColumn([
                'bukti_transfer',
                'status_verifikasi',
                'catatan_verifikasi',
                'tanggal_verifikasi',
                'id_verifikator'
            ]);
        });
    }
};
