import { useState } from "react";
import { Link } from "react-router-dom";
import "./SymptomChecker.css";

const symptomsData = [
  { id: "fever", icon: "🤒", label: "Fever & Flu", department: "General Medicine", recDoctor: "Dr. General Practitioner", desc: "Common cold, viral fever, fatigue, or body ache." },
  { id: "heart", icon: "🫀", label: "Chest Tightness / Palpitations", department: "Cardiology", recDoctor: "Dr. Heart Specialist", desc: "Shortness of breath, elevated blood pressure, or chest pain." },
  { id: "skin", icon: "🧴", label: "Skin Rash & Allergy", department: "Dermatology", recDoctor: "Dr. Skin Specialist", desc: "Eczema, acne, skin redness, or allergic reaction." },
  { id: "child", icon: "👶", label: "Child Health & Vaccine", department: "Pediatrics", recDoctor: "Dr. Pediatrician", desc: "Infant fever, immunization, growth tracking." },
  { id: "neuro", icon: "🧠", label: "Migraine & Dizziness", department: "Neurology", recDoctor: "Dr. Neuro Specialist", desc: "Chronic headache, nerve numbness, balance loss." },
  { id: "bone", icon: "🦴", label: "Joint & Spine Pain", department: "Orthopedics", recDoctor: "Dr. Ortho Surgeon", desc: "Back ache, knee stiffness, bone fracture check." },
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
            <div className="doc-avatar-small">🩺</div>
            <div>
              <span className="rec-doc-label">Recommended Care Specialist</span>
              <span className="rec-doc-name">{selectedSymptom.recDoctor}</span>
            </div>
          </div>

          <Link
            to="/OurDoctors"
            state={{ specialization: selectedSymptom.department }}
            className="btn-book-recommendation"
          >
            👨‍⚕️ View & Book {selectedSymptom.department} Specialist →
          </Link>
        </div>
      </div>
    </div>
  );
}
