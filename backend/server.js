import express from "express";
import fileUpload from "express-fileupload";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// ✅ Koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tugas_akhir",
});

db.connect((err) => {
  if (err) console.error("❌ DB Error:", err);
  else console.log("✅ MySQL Connected");
});

// ==========================
// 🔐 AUTH
// ==========================

// ✅ Register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, password, "user"], (err) => {
    if (err) return res.json({ error: err });
    return res.json({ message: "Register Success" });
  });
});


// ✅ Login
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json({ error: err });

    if (data.length > 0) {
      const user = data[0];
      return res.json({
        message: "Success",
        id: user.id,
        role: user.role,
        name: user.name,
      });
    } else {
      return res.json({ message: "Wrong Email or Password" });
    }
  });
});

// ✅ Statistik user
app.get("/users/statistik", (req, res) => {
  const sql = "SELECT COUNT(*) AS total_user FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err });
    return res.json(data[0]);
  });
});

// ✅ Get semua user
app.get("/users", (req, res) => {
  const sql = "SELECT id, name, email, role FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err });
    return res.json(data);
  });
});

// ==========================
// 📊 Statistik
// ==========================

// ✅ Jumlah penginapan per tipe (buat chart)
app.get("/penginapan/per-tipe", (req, res) => {
  const sql = `
    SELECT tipe_penginapan, COUNT(*) AS total 
    FROM penginapan 
    GROUP BY tipe_penginapan
  `;
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err });
    return res.json(data);
  });
});

// ✅ Statistik total, rata2 rating, rata2 harga
app.get("/penginapan/statistik", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total_penginapan, 
      ROUND(AVG(rating), 2) AS rata_rating, 
      ROUND(AVG(harga), 0) AS rata_harga 
    FROM penginapan
  `;
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err });
    return res.json(data[0]);
  });
});

// ==========================
// 🏨 CRUD PENGINAPAN
// ==========================

// ✅ Get semua penginapan
app.get("/penginapan", (req, res) => {
  const sql = "SELECT * FROM penginapan";
  db.query(sql, (err, data) => {
    if (err) return res.json({ error: err });

    const formatted = data.map((item) => ({
      ...item,
      image: item.image ? Buffer.from(item.image).toString("base64") : null,
    }));

    return res.json(formatted);
  });
});

// ✅ Get 1 penginapan by ID
app.get("/penginapan/:id", (req, res) => {
  const sql = "SELECT * FROM penginapan WHERE id = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.json({ error: err });

    if (data.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const item = data[0];
    return res.json({
      ...item,
      image: item.image ? Buffer.from(item.image).toString("base64") : null,
    });
  });
});

// ✅ Tambah penginapan
app.post("/penginapan", (req, res) => {
  const { nama_penginapan, tipe_penginapan, rating, jumlah_review, harga, fasilitas, lokasi, deskripsi } = req.body;
  const image = req.files ? req.files.image : null;

  const sql = `
    INSERT INTO penginapan 
    (nama_penginapan, tipe_penginapan, rating, jumlah_review, harga, fasilitas, lokasi, deskripsi, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nama_penginapan,
    tipe_penginapan,
    rating,
    jumlah_review,
    harga,
    fasilitas,
    lokasi,
    deskripsi,
    image ? image.data : null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ error: err });
    return res.json({ message: "Data berhasil ditambahkan", id: result.insertId });
  });
});

// ✅ Update penginapan by ID
app.put("/penginapan/:id", (req, res) => {
  const { nama_penginapan, tipe_penginapan, rating, jumlah_review, harga, fasilitas, lokasi, deskripsi } = req.body;
  const image = req.files ? req.files.image : null;

  let sql, values;

  if (image) {
    sql = `
      UPDATE penginapan 
      SET nama_penginapan=?, tipe_penginapan=?, rating=?, jumlah_review=?, harga=?, fasilitas=?, lokasi=?, deskripsi=?, image=? 
      WHERE id=?`;
    values = [nama_penginapan, tipe_penginapan, rating, jumlah_review, harga, fasilitas, lokasi, deskripsi, image.data, req.params.id];
  } else {
    sql = `
      UPDATE penginapan 
      SET nama_penginapan=?, tipe_penginapan=?, rating=?, jumlah_review=?, harga=?, fasilitas=?, lokasi=?, deskripsi=? 
      WHERE id=?`;
    values = [nama_penginapan, tipe_penginapan, rating, jumlah_review, harga, fasilitas, lokasi, deskripsi, req.params.id];
  }

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ error: err });
    return res.json({ message: "Data berhasil diupdate" });
  });
});

// ✅ Hapus penginapan by ID
app.delete("/penginapan/:id", (req, res) => {
  const sql = "DELETE FROM penginapan WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json({ error: err });
    return res.json({ message: "Data berhasil dihapus" });
  });
});



// ==========================
// ❤️ FAVORITES
// ==========================

// ✅ Get semua favorit user
app.get("/favorite/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT p.* 
    FROM favorites f 
    JOIN penginapan p ON f.penginapan_id = p.id 
    WHERE f.user_id = ?
  `;
  db.query(sql, [userId], (err, data) => {
    if (err) return res.json({ error: err });

    const formatted = data.map((item) => ({
      ...item,
      image: item.image ? Buffer.from(item.image).toString("base64") : null,
    }));

    return res.json(formatted);
  });
});

// ✅ Tambah favorit
app.post("/favorite", (req, res) => {
  const { user_id, penginapan_id } = req.body;

  const checkSql = "SELECT * FROM favorites WHERE user_id = ? AND penginapan_id = ?";
  db.query(checkSql, [user_id, penginapan_id], (err, result) => {
    if (err) return res.json({ error: err });

    if (result.length > 0) {
      return res.json({ message: "Sudah ada di favorit" });
    }

    const insertSql = "INSERT INTO favorites (user_id, penginapan_id) VALUES (?, ?)";
    db.query(insertSql, [user_id, penginapan_id], (err2) => {
      if (err2) return res.json({ error: err2 });
      return res.json({ message: "Ditambahkan ke favorit" });
    });
  });
});

// ✅ Hapus favorit
app.delete("/favorite/:userId/:penginapanId", (req, res) => {
  const { userId, penginapanId } = req.params;
  const sql = "DELETE FROM favorites WHERE user_id = ? AND penginapan_id = ?";
  db.query(sql, [userId, penginapanId], (err) => {
    if (err) return res.json({ error: err });
    return res.json({ message: "Dihapus dari favorit" });
  });
});


// ==========================
// 🚀 Run Server
// ==========================
app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});
