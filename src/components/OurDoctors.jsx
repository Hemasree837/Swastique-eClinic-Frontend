import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import drHemasree from "../assets/dr_hemasree.jpg";
import API from "../api";
import "./OurDoctors.css";

function getInitials(name) {
  if (!name) return "DR";
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

function DoctorAvatar({ name, src }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="avatar-initials">{getInitials(name)}</div>;
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="doctor-avatar-img"
    />
  );
}

const specializationsList = [
  "All Specializations",
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Orthopedics",
];

const featuredHemasreeDoctor = {
  id: "dr_k_hemasree",
  name: "Dr. K Hemasree",
  specialization: "General Medicine / OPD Lead",
  experience: 8,
  imageUrl: drHemasree,
  availableSlots: ["9:00 AM", "11:30 AM", "3:00 PM", "5:30 PM"],
  onLeave: false,
};

export default function OurDoctors({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All Specializations");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [activeReviewDoctor, setActiveReviewDoctor] = useState(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/doctor`);
      const apiDocs = res.data || [];
      
      // Ensure Dr. K Hemasree is featured at the top if not already present from backend
      const hasHemasree = apiDocs.some(
        (d) => d.name?.toLowerCase().includes("hemasree")
      );

      if (!hasHemasree) {
        setDoctors([featuredHemasreeDoctor, ...apiDocs]);
      } else {
        setDoctors(apiDocs);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([featuredHemasreeDoctor]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!activeReviewDoctor) return;

    const reviewObj = {
      user: user?.username || "Anonymous Patient",
      rating: reviewStars,
      comment: reviewComment || "Great consultation and thorough checkup!",
      date: new Date().toLocaleDateString(),
    };

    const storageKey = `doctor_reviews_${activeReviewDoctor.id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existing.unshift(reviewObj);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    setReviewComment("");
    setActiveReviewDoctor(null);
  };

  const filteredDoctors = doctors.filter((d) => {
    const nameMatch = d.name?.toLowerCase().includes(search.toLowerCase());
    const specMatch = d.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = nameMatch || specMatch;

    const matchesSpecFilter =
      selectedSpec === "All Specializations" ||
      d.specialization?.toLowerCase().includes(selectedSpec.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && !d.onLeave) ||
      (availabilityFilter === "leave" && d.onLeave);

    return matchesSearch && matchesSpecFilter && matchesAvailability;
  });

  return (
    <div className="doctors-page">
      {/* Header Banner */}
      <div className="doctors-page-header glass-card">
        <div>
          <h2>Meet Our Specialist Doctors</h2>
          <p>Explore board-certified medical experts, view patient ratings, and book instant appointments.</p>
        </div>

        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filters-container">
        <div className="spec-pills-row">
          {specializationsList.map((spec) => (
            <button
              key={spec}
              className={`spec-pill ${selectedSpec === spec ? "active" : ""}`}
              onClick={() => setSelectedSpec(spec)}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="availability-filter-group">
          <button
            className={`avail-btn ${availabilityFilter === "all" ? "active" : ""}`}
            onClick={() => setAvailabilityFilter("all")}
          >
            All Status
          </button>
          <button
            className={`avail-btn ${availabilityFilter === "available" ? "active" : ""}`}
            onClick={() => setAvailabilityFilter("available")}
          >
            🟢 Available Now
          </button>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading && (
        <div className="loading-state glass-card">
          <span className="spinner">🩺</span>
          <p>Loading doctor roster from clinic database...</p>
        </div>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <div className="empty-doctors-card glass-card">
          <span className="empty-icon">👨‍⚕️</span>
          <h3>No Doctors Match Your Search</h3>
          <p>Try clearing filters or searching for a different medical specialty.</p>
          <button className="btn-hero-secondary" onClick={() => { setSearch(""); setSelectedSpec("All Specializations"); setAvailabilityFilter("all"); }}>
            Reset All Filters
          </button>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="doctors-grid">
        {filteredDoctors.map((d) => {
          const slotsArray = Array.isArray(d.availableSlots)
            ? d.availableSlots
            : typeof d.availableSlots === "string"
            ? d.availableSlots.split(",")
            : [];

          const reviews = JSON.parse(localStorage.getItem(`doctor_reviews_${d.id}`) || "[]");

          return (
            <article className="doctor-card-modern glass-card" key={d.id}>
              <div className="doctor-card-top">
                <div className="avatar-frame">
                  <DoctorAvatar name={d.name} src={d.imageUrl} />
                </div>
                <div className="status-badge-container">
                  {d.onLeave ? (
                    <span className="status-pill status-leave">🔴 On Leave</span>
                  ) : (
                    <span className="status-pill status-active">🟢 Available</span>
                  )}
                </div>
              </div>

              <div className="doctor-card-body">
                <h3 className="doctor-name">{d.name}</h3>
                <span className="doctor-specialty">{d.specialization || "General Medicine"}</span>
                
                <div className="doctor-meta-row">
                  <span className="meta-badge">🏅 {d.experience || "0"} Yrs Experience</span>
                  <span className="meta-badge">⭐ 4.9 ({reviews.length + 12} Reviews)</span>
                </div>

                <div className="slots-section">
                  <span className="slots-label">Available Slots:</span>
                  <div className="slots-chips">
                    {slotsArray.length > 0 ? (
                      slotsArray.map((slot, idx) => (
                        <span className="slot-chip" key={idx}>{slot.trim()}</span>
                      ))
                    ) : (
                      <span className="no-slots">Contact Desk</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="doctor-card-footer">
                <Link
                  to="/BookAppointment"
                  state={{ doctorId: d.id, doctorName: d.name }}
                  className="btn-book-doctor"
                >
                  📅 Schedule Visit
                </Link>
                <button
                  className="btn-hero-secondary"
                  style={{ width: "100%", marginTop: "8px", fontSize: "12px", padding: "6px" }}
                  onClick={() => setActiveReviewDoctor(d)}
                >
                  ⭐ Write Patient Review
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Review Modal */}
      {activeReviewDoctor && (
        <div className="rx-modal-overlay" onClick={() => setActiveReviewDoctor(null)}>
          <div className="rx-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>Rate & Review {activeReviewDoctor.name}</h3>
            <p className="tab-subtitle">Share your feedback about your consultation experience.</p>

            <form onSubmit={handleSaveReview} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="input-group">
                <label className="input-label">Star Rating</label>
                <select value={reviewStars} onChange={(e) => setReviewStars(Number(e.target.value))}>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                  <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                  <option value="2">⭐⭐ 2 Stars (Fair)</option>
                  <option value="1">⭐ 1 Star (Poor)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Your Review & Comments</label>
                <textarea
                  rows="3"
                  placeholder="Describe doctor punctuality, diagnosis accuracy, or clinic staff guidance..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="btn-link" onClick={() => setActiveReviewDoctor(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-hero-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}