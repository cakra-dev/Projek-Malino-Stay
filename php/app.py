from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load data
df = pd.read_csv('data.csv')  # harus ada kolom 'content'

# Hitung TF-IDF matrix sekali saja
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['content'])

# Hitung cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Fungsi rekomendasi
def recommend(title, top_n=5):
    indices = pd.Series(df.index, index=df['title']).drop_duplicates()
    idx = indices[title]

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:top_n+1]

    article_indices = [i[0] for i in sim_scores]
    return df['title'].iloc[article_indices].tolist()

# Route frontend
@app.route('/')
def index():
    return render_template('index.html')

# API untuk rekomendasi
@app.route('/recommend', methods=['POST'])
def get_recommendations():
    title = request.form['title']
    results = recommend(title)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
