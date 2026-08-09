import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api";
import "./Reporter.css";

export default function Reporter() {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/doctor`);
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLeave = async (id, currentStatus) => {
    try {
      await axios.put(`${API}/doctor/${id}/leave`, {
        onLeave: !currentStatus,
      });
      fetchDoctors();
    } catch (err) {
      console.error("Error toggling doctor leave status:", err);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    if (filter === "leave") return d.onLeave;
    if (filter === "available") return !d.onLeave;
    return true;
  });

  return (
    <div className="reporter-page-container">
      <div className="reporter-header glass-card">
        <div>
          <h2>Desk Reporter Panel</h2>
          <p>Toggle real-time doctor attendance & availability roster.</p>
        </div>

        <div className="reporter-filter-pills">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Doctors ({doctors.length})
          </button>
          <button
            className={`filter-btn ${filter === "available" ? "active" : ""}`}
            onClick={() => setFilter("available")}
          >
            🟢 Available ({doctors.filter((d) => !d.onLeave).length})
          </button>
          <button
            className={`filter-btn ${filter === "leave" ? "active" : ""}`}
            onClick={() => setFilter("leave")}
          >
            🔴 On Leave ({doctors.filter((d) => d.onLeave).length})
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-state glass-card">
          <span className="spinner">📋</span>
          <p>Loading doctor duty roster...</p>
        </div>
      )}

      <div className="reporter-grid">
        {filteredDoctors.map((d) => (
          <div className="reporter-card glass-card" key={d.id}>
            <div className="reporter-doc-header">
              <div className="doc-avatar-chip">
                {d.imageUrl ? (
                  <img src={d.imageUrl} alt={d.name} />
                ) : (
                  <span>{d.name ? d.name[0] : "D"}</span>
                )}
              </div>
              <div>
                <h4>{d.name}</h4>
                <span className="doc-spec">{d.specialization}</span>
              </div>
            </div>

            <div className="status-toggle-row">
              <span className={`status-pill ${d.onLeave ? "status-leave" : "status-active"}`}>
                {d.onLeave ? "🔴 On Leave" : "🟢 Available Now"}
              </span>

              <button
                className="btn-toggle-status"
                onClick={() => toggleLeave(d.id, d.onLeave)}
              >
                {d.onLeave ? "Set Available" : "Mark On Leave"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}