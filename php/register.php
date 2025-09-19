<?php
require 'koneksi.php';
$nama = $_POST["nama"];
$email = $_POST["email"];
$password = $_POST["password"];

$query_user = "INSERT INTO user (nama, email, password) VALUES ('$nama', '$email', '$password')";

if (mysqli_query($conn, $query_user)) {
    header("Location: login.html");
} else {
    echo "Error: " . mysqli_error($conn);
}