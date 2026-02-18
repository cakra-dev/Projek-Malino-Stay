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

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="tugas_akhir"
)

factory = StopWordRemoverFactory()
stopwords = factory.get_stop_words()

@app.route("/recommendations/<int:penginapan_id>", methods=["GET"])
def recommend(penginapan_id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM penginapan")
    rows = cursor.fetchall()
    cursor.close()

    if not rows:
        return jsonify({"target_id": penginapan_id, "recommendations": []})

    df = pd.DataFrame(rows)

    # Pastikan kolom teks tidak NaN
    for col in ["nama_penginapan", "tipe_penginapan", "fasilitas", "deskripsi"]:
        if col in df.columns:
            df[col] = df[col].fillna("").astype(str)

    # Pastikan kolom numerik benar-benar numerik
    df["rating_num"] = pd.to_numeric(df.get("rating", 0), errors="coerce").fillna(0.0)
    df["harga_num"]  = pd.to_numeric(df.get("harga", 0),  errors="coerce").fillna(0.0)

    # Combined text untuk TF-IDF
    df["combined_text"] = (
        df["nama_penginapan"] + " " +
        df["tipe_penginapan"] + " " +
        df["rating_num"].astype(str) + " " +
        df.get("fasilitas", "").astype(str) + " " +
        df.get("deskripsi", "").astype(str)
    ).str.lower()

    tfidf = TfidfVectorizer(stop_words=stopwords)
    tfidf_matrix = tfidf.fit_transform(df["combined_text"])

    # Cari index penginapan target
    idx_list = df.index[pd.to_numeric(df["id"], errors="coerce").fillna(-1).astype(int) == int(penginapan_id)].tolist()
    if not idx_list:
        return jsonify({"target_id": penginapan_id, "recommendations": []})
    idx = idx_list[0]

    cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()

    # Faktor harga
    target_price = float(df.loc[idx, "harga_num"])
    max_price = float(df["harga_num"].max())
    min_price = float(df["harga_num"].min())

    if max_price == min_price:
        df["price_score"] = 1.0
    else:
        df["price_score"] = 1 - (abs(df["harga_num"] - target_price) / (max_price - min_price))

    sim_atribut, sim_price = 0.5, 0.5
    final_scores = (sim_atribut * cosine_sim) + (sim_price * df["price_score"].values)

    sim_scores = sorted(list(enumerate(final_scores)), key=lambda x: x[1], reverse=True)
    sim_scores = [s for s in sim_scores if s[0] != idx][:10]

    recommendations = []
    for idx_sim, sim in sim_scores:
        row = df.iloc[idx_sim]

        combined_attr = (
            f"{row.get('nama_penginapan','')} | "
            f"{row.get('tipe_penginapan','')} | "
            f"Rating: {row.get('rating_num',0)} | "
            f"Harga: {row.get('harga_num',0)} | "
            f"Fasilitas: {row.get('fasilitas','')} | "
            f"Deskripsi: {row.get('deskripsi','')}"
        )

        img_val = row.get("image", None)
        img_b64 = base64.b64encode(img_val).decode("utf-8") if isinstance(img_val, (bytes, bytearray)) else None

        recommendations.append({
            "id": int(row.get("id")),
            "nama_penginapan": row.get("nama_penginapan", ""),
            "rating": float(row.get("rating_num", 0.0)),
            "harga": int(float(row.get("harga_num", 0.0))),

            "combined_attr": combined_attr,

            "final_score": round(float(sim), 4),
            "content_similarity": round(float(cosine_sim[idx_sim]), 4),
            "price_score": round(float(row.get("price_score", 0.0)), 4),
            "image": img_b64
        })

    return jsonify({"target_id": int(penginapan_id), "recommendations": recommendations})

if __name__ == "__main__":
    app.run(port=5000, debug=True)