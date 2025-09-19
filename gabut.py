import time
import sys

lyrics = [
    "Sungguh sayang aku tak bisa langsung mengungkapkan",
    "Perasaan yang kusimpan buatku tak tenang",
    "Ini semua karna hubungan pertemanan",
    "Kau sudah biasa anggapku sebagai kawan"
]

def type_out(text, delay=0.05):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print() 

if __name__ == "__main__":
    print("======== Mesrah Banget ========\n")
    time.sleep(3)

    for line in lyrics:
        type_out(line, delay=0.08) 
        time.sleep(0.5)      

