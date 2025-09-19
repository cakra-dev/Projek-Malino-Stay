<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "tugas_akhir";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
} else {
    echo "Koneksi berhasil";
}
?>
