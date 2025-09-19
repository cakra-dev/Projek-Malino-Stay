<?php
require 'koneksi.php';

$email = $_POST["email"];
$password = $_POST["password"];

// Cek user by email
$query_user = "SELECT * FROM user WHERE email = '$email'";
$result = mysqli_query($conn, $query_user);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);

    if (password_verify($password, $row['password'])) {
        header("Location: home.html");
        exit;
    } else {
        echo "Password salah";
    }
} else {
    echo "Email tidak ditemukan";
}
?>
