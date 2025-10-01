import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar  } from "react-icons/fa";

function PenginapanCard({ id, image, name, rating, price, similarity, isFavorite, onFavorite, onClick }) {
  return (
    <div
      className="card shadow-sm rounded-4 position-relative h-100 d-flex flex-column"
      style={{
        cursor: "pointer",
        minWidth: "350px",   // ukuran minimum sama
        maxWidth: "250px",   // biar nggak berubah-ubah
        height: "380px"      // tinggi tetap
      }}
      onClick={onClick}
    >
      {/* Gambar */}
      <img
        src={image}
        alt={name}
        className="card-img-top rounded-top-4"
        style={{ height: "180px", objectFit: "cover" }}
      />

      {/* Icon Favorite */}
      <button
        className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center rounded-circle shadow-sm"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "white",
          border: "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onFavorite();
        }}
      >
        <FaHeart
          size={20}
          className={isFavorite ? "text-danger" : "text-secondary"}
        />
      </button>

      {/* Body */}
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h6 className="fw-bold mb-2 text-truncate">{name}</h6>

          {/* Rating */}
          <p className="mb-2 d-flex align-items-center">
            {[1, 2, 3, 4, 5].map((star) => {
              if (rating >= star) {
                return <FaStar key={star} color="#ffc107" size={16} />;
              } else if (rating >= star - 0.5) {
                return <FaStarHalfAlt key={star} color="#ffc107" size={16} />;
              } else {
                return <FaRegStar key={star} color="#ffc107" size={16} />;
              }
            })}
            <span className="text-muted ms-2">({Number(rating).toFixed(1)})</span>
          </p>


          {/* Harga */}
          <p className="fw-bold text-primary">
            Rp {Number(price).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Similarity */}
        {similarity !== undefined && (
          <p className="text-muted mb-0">
            Kemiripan: {Number(similarity * 100).toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}

export default PenginapanCard;
