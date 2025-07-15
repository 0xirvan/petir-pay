<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PelangganExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $pelanggan;

    public function __construct($pelanggan)
    {
        $this->pelanggan = $pelanggan;
    }

    public function collection()
    {
        return $this->pelanggan;
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama',
            'Email',
            'Nomor Meter',
            'Alamat',
            'Daya (VA)',
            'Tarif/kWh',
            'Tanggal Daftar',
        ];
    }

    public function map($pelanggan): array
    {
        static $counter = 0;
        $counter++;

        return [
            $counter,
            $pelanggan->nama,
            $pelanggan->email,
            $pelanggan->nomor_meter,
            $pelanggan->alamat,
            $pelanggan->tarif ? $pelanggan->tarif->daya . ' VA' : '-',
            $pelanggan->tarif ? 'Rp ' . number_format($pelanggan->tarif->tarif_per_kwh, 0, ',', '.') : '-',
            $pelanggan->created_at->format('d/m/Y'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
