import { FaMapMarkerAlt } from "react-icons/fa";

const landmarks = [
  { label: "Hutan Pinus Malino", key: "area_HPM" },
  { label: "Kampoeng Eropa Malino", key: "area_KEM" },
  { label: "Air Terjun Takapala", key: "area_ATT" },
  { label: "Wisata Malino", key: "area_WM" },
  { label: "Malino Highlands", key: "area_MH" },
];

function AreaTerdekat({ hotel }) {
  return (
    <div className="mt-5">
      <div className="card shadow-sm rounded-4 overflow-hidden">
        {/* Header */}
        <div className="card-header bg-white d-flex align-items-center justify-content-center gap-2 py-3">
          <FaMapMarkerAlt className="text-secondary" />
          <span className="fw-semibold text-secondary" style={{ fontSize: "14px" }}>
            Area Wisata Terdekat
          </span>
        </div>

        {/* List jarak */}
        <ul className="list-group list-group-flush">
          {landmarks.map((lm, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center px-4 py-3"
            >
              <span style={{ fontSize: "14px" }}>{lm.label}</span>
              <span className="text-muted" style={{ fontSize: "13px" }}>
                {hotel[lm.key] ?? "-"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AreaTerdekat;
