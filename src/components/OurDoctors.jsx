import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import drHemasree from "../assets/dr_hemasree.jpg";
import drJithendra from "../assets/dr_jithendra.jpg";
import drArjun from "../assets/dr_arjun.jpg";
import drPriyanka from "../assets/dr_priyanka.jpg";
import drRahul from "../assets/dr_rahul.jpg";
import drMeghana from "../assets/dr_meghana.jpg";
import drVikram from "../assets/dr_vikram.jpg";
import drNisha from "../assets/dr_nisha.jpg";
import drAditya from "../assets/dr_aditya.jpg";
import drSneha from "../assets/dr_sneha.jpg";
import drSiddharth from "../assets/dr_siddharth.jpg";

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

function matchesSpecialty(docSpec, filterSpec) {
  if (!docSpec || !filterSpec || filterSpec === "All Specializations") return true;

  const docLower = docSpec.toLowerCase();
  const filterLower = filterSpec.toLowerCase();

  if (docLower.includes(filterLower) || filterLower.includes(docLower)) return true;

  // Extract root word (e.g., "cardio", "derma", "ortho", "pediatr", "gynec", "psych", "radiolog", "ophthalm")
  const docRoot = docLower.replace(/(ology|ologist|ics|ist|ian|ic|s)$/g, "").trim();
  const filterRoot = filterLower.replace(/(ology|ologist|ics|ist|ian|ic|s)$/g, "").trim();

  if (docRoot.length >= 3 && filterRoot.length >= 3) {
    if (docLower.includes(filterRoot) || filterLower.includes(docRoot)) return true;
  }

  return false;
}

const specializationsList = [
  "All Specializations",
  "General Medicine",
  "Family Medicine",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "ENT",
  "Pediatrics",
  "Radiology",
  "Ophthalmology",
  "Psychiatry",
];

const expertMedicalTeam = [
  {
    id: "dr_k_hemasree",
    name: "Dr. K. HEMASREE",
    specialization: "General Medicine / OPD Lead",
    qualification: "MBBS, MD (General Medicine)",
    experience: 8,
    imageUrl: drHemasree,
    availableSlots: ["9:00 AM", "11:30 AM", "3:00 PM", "5:30 PM"],
    onLeave: false,
  },
  {
    id: "dr_g_jithendra",
    name: "Dr. G. JITHENDRA KUMAR",
    specialization: "Family Medicine Specialist",
    qualification: "MBBS, MD (Family Medicine)",
    experience: 7,
    imageUrl: drJithendra,
    availableSlots: ["10:00 AM", "12:30 PM", "4:00 PM", "6:30 PM"],
    onLeave: false,
  },
  {
    id: "dr_arjun_reddy",
    name: "Dr. ARJUN REDDY",
    specialization: "Cardiology / Cardiologist",
    qualification: "MBBS, MD (Cardiology), DM",
    experience: 12,
    imageUrl: drArjun,
    availableSlots: ["10:00 AM", "2:00 PM", "6:00 PM"],
    onLeave: false,
  },
  {
    id: "dr_priyanka_nair",
    name: "Dr. PRIYANKA NAIR",
    specialization: "Dermatology / Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    experience: 7,
    imageUrl: drPriyanka,
    availableSlots: ["11:00 AM", "3:30 PM", "6:30 PM"],
    onLeave: false,
  },
  {
    id: "dr_rahul_varma",
    name: "Dr. RAHUL VARMA",
    specialization: "Orthopedics / Orthopedic Surgeon",
    qualification: "MBBS, MS (Orthopedics)",
    experience: 11,
    imageUrl: drRahul,
    availableSlots: ["9:30 AM", "1:00 PM", "4:30 PM"],
    onLeave: false,
  },
  {
    id: "dr_meghana_iyer",
    name: "Dr. MEGHANA IYER",
    specialization: "Gynecology & Obstetrics",
    qualification: "MBBS, MS (OBG)",
    experience: 9,
    imageUrl: drMeghana,
    availableSlots: ["10:30 AM", "2:30 PM", "5:00 PM"],
    onLeave: false,
  },
  {
    id: "dr_vikram_singh",
    name: "Dr. VIKRAM SINGH",
    specialization: "ENT / Ear, Nose & Throat Specialist",
    qualification: "MBBS, MS (ENT)",
    experience: 8,
    imageUrl: drVikram,
    availableSlots: ["9:00 AM", "12:00 PM", "3:30 PM"],
    onLeave: false,
  },
  {
    id: "dr_nisha_bhat",
    name: "Dr. NISHA BHAT",
    specialization: "Pediatrics / Pediatrician",
    qualification: "MBBS, MD (Pediatrics)",
    experience: 6,
    imageUrl: drNisha,
    availableSlots: ["11:00 AM", "2:00 PM", "5:30 PM"],
    onLeave: false,
  },
  {
    id: "dr_aditya_menon",
    name: "Dr. ADITYA MENON",
    specialization: "Radiology / Radiologist",
    qualification: "MBBS, MD (Radiology)",
    experience: 10,
    imageUrl: drAditya,
    availableSlots: ["9:00 AM", "1:30 PM", "4:00 PM"],
    onLeave: false,
  },
  {
    id: "dr_sneha_kulkarni",
    name: "Dr. SNEHA KULKARNI",
    specialization: "Ophthalmology / Eye Specialist",
    qualification: "MBBS, MS (Ophthalmology)",
    experience: 7,
    imageUrl: drSneha,
    availableSlots: ["10:00 AM", "1:00 PM", "6:00 PM"],
    onLeave: false,
  },
  {
    id: "dr_siddharth_jose",
    name: "Dr. SIDDHARTH JOSE",
    specialization: "Psychiatry & Neurology",
    qualification: "MBBS, MD (Psychiatry)",
    experience: 6,
    imageUrl: drSiddharth,
    availableSlots: ["11:30 AM", "3:00 PM", "7:00 PM"],
    onLeave: false,
  },
];

export default function OurDoctors({ user }) {
  const location = useLocation();
  const [doctors, setDoctors] = useState(expertMedicalTeam);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState(
    location.state?.selectedSpec || "All Specializations"
  );
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [activeReviewDoctor, setActiveReviewDoctor] = useState(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (location.state?.selectedSpec) {
      setSelectedSpec(location.state.selectedSpec);
    }
    fetchDoctorsFromBackend();
  }, [location.state]);

  const fetchDoctorsFromBackend = async () => {
    try {
      const res = await axios.get(`${API}/doctor`, { timeout: 6000 });
      const apiDocs = res.data || [];
      
      if (apiDocs.length > 0) {
        const existingNames = new Set(expertMedicalTeam.map((d) => d.name.toLowerCase()));
        const uniqueApiDocs = apiDocs.filter(
          (d) => !existingNames.has(d.name?.toLowerCase())
        );
        setDoctors([...expertMedicalTeam, ...uniqueApiDocs]);
      }
    } catch (err) {
      console.log("Using expert medical team roster.");
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

    const matchesSpecFilter = matchesSpecialty(d.specialization, selectedSpec);

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
          <span className="section-subtitle">👥 Our Specialist Doctors</span>
          <h2>Meet Our Expert Medical Team</h2>
          <p>Compassionate. Experienced. Dedicated to Your Health.</p>
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
                {d.qualification && <p className="doctor-qualification">🎓 {d.qualification}</p>}
                
                <div className="doctor-meta-row">
                  <span className="meta-badge">📅 {d.experience || "0"}+ Years Experience</span>
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