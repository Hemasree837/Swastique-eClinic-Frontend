import { useState } from "react";
import { Link } from "react-router-dom";

import drHemasree from "../assets/dr_hemasree.jpg";
import drJithendra from "../assets/dr_jithendra.jpg";
import drArjun from "../assets/dr_arjun.jpg";
import drPriyanka from "../assets/dr_priyanka.jpg";
import drNisha from "../assets/dr_nisha.jpg";
import drRahul from "../assets/dr_rahul.jpg";
import drSiddharth from "../assets/dr_siddharth.jpg";

import "./SymptomChecker.css";

const symptomsData = [
  {
    id: "fever",
    icon: "🤒",
    label: "Fever & Cold / OPD Consultation",
    department: "General Medicine",
    recDoctor: "Dr. K. HEMASREE",
    docId: "dr_k_hemasree",
    docImage: drHemasree,
    qualification: "MBBS, MD (General Medicine)",
    experience: "8+ Yrs Exp",
    desc: "Common cold, viral fever, fatigue, or outpatient general checkups.",
  },
  {
    id: "heart",
    icon: "🫀",
    label: "Chest Tightness / Palpitations",
    department: "Cardiology",
    recDoctor: "Dr. ARJUN REDDY",
    docId: "dr_arjun_reddy",
    docImage: drArjun,
    qualification: "MBBS, MD (Cardiology), DM",
    experience: "12+ Yrs Exp",
    desc: "Shortness of breath, elevated blood pressure, angina, or chest pain.",
  },
  {
    id: "skin",
    icon: "🧴",
    label: "Skin Rash & Allergy",
    department: "Dermatology",
    recDoctor: "Dr. PRIYANKA NAIR",
    docId: "dr_priyanka_nair",
    docImage: drPriyanka,
    qualification: "MBBS, MD (Dermatology)",
    experience: "7+ Yrs Exp",
    desc: "Eczema, acne, skin redness, hair loss, or allergic reactions.",
  },
  {
    id: "child",
    icon: "👶",
    label: "Child Health & Vaccine",
    department: "Pediatrics",
    recDoctor: "Dr. NISHA BHAT",
    docId: "dr_nisha_bhat",
    docImage: drNisha,
    qualification: "MBBS, MD (Pediatrics)",
    experience: "6+ Yrs Exp",
    desc: "Infant fever, child immunization schedule, and pediatric growth tracking.",
  },
  {
    id: "family",
    icon: "🩺",
    label: "Family Medicine & Routine Checkup",
    department: "Family Medicine",
    recDoctor: "Dr. G. JITHENDRA KUMAR",
    docId: "dr_g_jithendra",
    docImage: drJithendra,
    qualification: "MBBS, MD (Family Medicine)",
    experience: "7+ Yrs Exp",
    desc: "Preventive health screenings, diabetes management, and family health guidance.",
  },
  {
    id: "neuro",
    icon: "🧠",
    label: "Migraine & Dizziness",
    department: "Psychiatry & Neurology",
    recDoctor: "Dr. SIDDHARTH JOSE",
    docId: "dr_siddharth_jose",
    docImage: drSiddharth,
    qualification: "MBBS, MD (Psychiatry)",
    experience: "6+ Yrs Exp",
    desc: "Chronic headaches, anxiety, nerve numbness, sleep issues, or dizziness.",
  },
  {
    id: "bone",
    icon: "🦴",
    label: "Joint & Spine Pain",
    department: "Orthopedics",
    recDoctor: "Dr. RAHUL VARMA",
    docId: "dr_rahul_varma",
    docImage: drRahul,
    qualification: "MBBS, MS (Orthopedics)",
    experience: "11+ Yrs Exp",
    desc: "Back ache, knee stiffness, joint inflammation, or bone injury checks.",
  },
];

export default function SymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(symptomsData[0]);

  return (
    <div className="symptom-checker-card glass-card">
      <div className="symptom-header">
        <span className="symptom-badge">🤖 AI Health Triage Assistant</span>
        <h2>Interactive Symptom Checker</h2>
        <p>Select your current symptom to instantly find the right medical department and recommended doctor.</p>
      </div>

      <div className="symptom-checker-grid">
        {/* Left Column: Symptom Selectors */}
        <div className="symptoms-list">
          {symptomsData.map((item) => (
            <button
              key={item.id}
              className={`symptom-btn ${selectedSymptom.id === item.id ? "active" : ""}`}
              onClick={() => setSelectedSymptom(item)}
            >
              <span className="sym-icon">{item.icon}</span>
              <span className="sym-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Column: Recommendation Card */}
        <div className="recommendation-box glass-card">
          <div className="rec-badge">Matched Specialty</div>
          <h3 className="rec-dept">{selectedSymptom.department}</h3>
          <p className="rec-desc">{selectedSymptom.desc}</p>

          <div className="rec-doctor-chip">
            <div className="doc-avatar-frame-small">
              <img src={selectedSymptom.docImage} alt={selectedSymptom.recDoctor} />
            </div>
            <div className="rec-doc-info">
              <span className="rec-doc-label">Recommended Care Specialist</span>
              <span className="rec-doc-name">{selectedSymptom.recDoctor}</span>
              <span className="rec-doc-qual">🎓 {selectedSymptom.qualification}</span>
              <span className="rec-doc-exp">🏅 {selectedSymptom.experience}</span>
            </div>
          </div>

          <Link
            to="/BookAppointment"
            state={{ doctorId: selectedSymptom.docId, doctorName: selectedSymptom.recDoctor }}
            className="btn-book-recommendation"
          >
            📅 Schedule Visit with {selectedSymptom.recDoctor} →
          </Link>
        </div>
      </div>
    </div>
  );
}
