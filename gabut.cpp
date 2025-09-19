#include <iostream>
#include <string>
#include <thread>   // untuk sleep
#include <chrono>   // untuk durasi

using namespace std;

void type_out(const string &text, int delay_ms = 80) {
    for (char c : text) {
        cout << c << flush; // flush biar langsung tampil per huruf
        this_thread::sleep_for(chrono::milliseconds(delay_ms));
    }
    cout << endl; // pindah baris setelah selesai
}

int main() {
    string lyrics[] = {
        "Sungguh sayang aku tak bisa langsung mengungkapkan",
        "Perasaan yang kusimpan buatku tak tenang",
        "Ini semua kar'na hubungan pertemanan",
        "Kau sudah biasa anggapku sebagai kawan"
    };

    cout << "Memulai lirik berjalan (efek ketik)..." << endl << endl;
    this_thread::sleep_for(chrono::seconds(1));

    for (const string &line : lyrics) {
        type_out(line, 80); // 80 ms per huruf (atur sesuai selera)
        this_thread::sleep_for(chrono::milliseconds(500)); // jeda antar baris
    }

    return 0;
}