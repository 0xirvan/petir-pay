MENU_INPUT = "1"
MENU_SORT = "2"
MENU_SEARCH = "3"
MENU_EXIT = "4"


def input_angka():
    global angka, n
    angka = []
    n = int(input("Masukkan jumlah nilai tugas: "))
    print("Input Angka")
    print("-" * 40)
    for i in range(n):
        nilai = int(input(f"Angka {i+1}: "))
        angka.append(nilai)


def sorting():
    global angka
    # Bubble Sort
    for i in range(len(angka)):
        for j in range(i + 1, len(angka)):
            if angka[i] > angka[j]:
                angka[i], angka[j] = angka[j], angka[i]
    print("\nTAMPIL HASIL SORTING")
    print("Hasil sorting:", ", ".join(map(str, angka)))


def searching():
    global angka
    if not angka:
        print("Data kosong. Silakan input angka dulu.")
        return
    cari = int(input("Masukkan angka yang dicari: "))
    ditemukan = False
    for a in angka:
        if a == cari:
            ditemukan = True
            break
    print("\nTAMPIL HASIL SEARCHING")
    if ditemukan:
        print("Angka ditemukan di indeks:", angka.index(cari))
    else:
        print("Angka tidak ditemukan")


# Main Program
angka = []
n = 0

while True:
    print("\nMENU PILIHAN")
    print("1. Input angka")
    print("2. Sorting")
    print("3. Searching")
    print("4. Selesai")
    pilihan = input("Masukkan pilihan [1/2/3/4]: ")

    if pilihan == MENU_INPUT:
        input_angka()
    elif pilihan == MENU_SORT:
        if angka:
            sorting()
        else:
            print("Silakan input angka terlebih dahulu.")
    elif pilihan == MENU_SEARCH:
        searching()
    elif pilihan == MENU_EXIT:
        print("Program selesai.")
        break
    else:
        print("Pilihan tidak valid. Coba lagi.")
