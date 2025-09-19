from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
import base64

app = Flask(__name__)
CORS(app)

# ✅ Koneksi MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="tugas_akhir"
)

# ✅ Buat stopwords bahasa Indonesia pakai Sastrawi
factory = StopWordRemoverFactory()
stopwords = factory.get_stop_words()

# ✅ Endpoint rekomendasi
@app.route("/recommendations/<int:penginapan_id>", methods=["GET"])
def recommend(penginapan_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM penginapan")
    rows = cursor.fetchall()
    cursor.close()

    if not rows:
        return jsonify([])

    df = pd.DataFrame(rows)

    # Gabungkan teks untuk perhitungan TF-IDF
    df["combined"] = (
        df["nama_penginapan"].astype(str) + " " +
        df["tipe_penginapan"].astype(str) + " " +
        df["fasilitas"].astype(str) + " " +
        df["deskripsi"].astype(str)
    )

    # ✅ Vectorisasi TF-IDF dengan stopwords Indonesia
    tfidf = TfidfVectorizer(stop_words=stopwords)
    tfidf_matrix = tfidf.fit_transform(df["combined"])

    # Cari index penginapan target
    try:
        idx = df.index[df["id"] == penginapan_id][0]
    except IndexError:
        return jsonify([])

    # Hitung cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()

    # Urutkan rekomendasi (skip index sendiri)
    sim_scores = list(enumerate(cosine_sim))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [s for s in sim_scores if s[0] != idx]  # buang yang sama

    # Ambil top 5 dengan similarity
    top_scores = sim_scores[:10]  # [(index, similarity), ...]
    recommendations = []

    for idx_sim, sim in top_scores:
        r = df.iloc[idx_sim].to_dict()
        r["similarity"] = float(sim)  # ✅ tambahkan similarity
        if isinstance(r.get("image"), (bytes, bytearray)):
            r["image"] = base64.b64encode(r["image"]).decode("utf-8")
        else:
            r["image"] = None
        recommendations.append(r)

    return jsonify(recommendations)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
