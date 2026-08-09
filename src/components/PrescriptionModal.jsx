import { useState } from "react";
import logo from "../assets/logo.jpeg";
import "./PrescriptionModal.css";

export default function PrescriptionModal({ appointment, onClose, onSave, isViewOnly = false, initialPrescription = null }) {
  const [medicines, setMedicines] = useState(
    initialPrescription?.medicines || [
      { name: "Paracetamol 500mg", dosage: "1 Tablet", frequency: "1-0-1 (After Food)", duration: "5 Days" },
    ]
  );
  const [advice, setAdvice] = useState(initialPrescription?.advice || "Take plenty of rest, drink warm water, and follow up in 7 days.");
  const [diagnosis, setDiagnosis] = useState(initialPrescription?.diagnosis || "Mild Viral Fever & Seasonal Allergy");

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: "", dosage: "1 Tablet", frequency: "1-0-1", duration: "3 Days" }]);
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const prescriptionData = {
      appointmentId: appointment.id,
      patientName: appointment.patientName,
      doctorName: appointment.doctorName,
      date: new Date().toLocaleDateString(),
      diagnosis,
      medicines,
      advice,
    };
    onSave(prescriptionData);
  };

  return (
    <div className="rx-modal-overlay" onClick={onClose}>
      <div className="rx-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Printable Rx Header */}
        <div className="rx-header-bar">
          <div className="rx-brand">
            <img src={logo} alt="Swastiq eClinic" className="rx-logo" />
            <div>
              <h2>Swastiq eClinic — Digital Rx</h2>
              <p>123 Wellness Avenue, Health City • Tel: +91 98765 43210</p>
            </div>
          </div>
          <div className="rx-symbol">℞</div>
        </div>

        {/* Patient & Doctor Meta Banner */}
        <div className="rx-meta-grid">
          <div>
            <span className="rx-meta-label">Patient Name:</span>
            <strong className="rx-meta-value">{appointment?.patientName || "Patient"}</strong>
          </div>
          <div>
            <span className="rx-meta-label">Consulting Doctor:</span>
            <strong className="rx-meta-value">{appointment?.doctorName || "Dr. Medical Specialist"}</strong>
          </div>
          <div>
            <span className="rx-meta-label">Date:</span>
            <span className="rx-meta-value">{appointment?.date || new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="rx-meta-label">Visit ID:</span>
            <span className="rx-meta-value">#RX-{appointment?.id || "101"}</span>
          </div>
        </div>

        {/* Diagnosis Block */}
        <div className="rx-section">
          <label className="rx-section-title">Clinical Diagnosis / Remarks:</label>
          {!isViewOnly ? (
            <input
              type="text"
              className="rx-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Rhinitis & Headache"
            />
          ) : (
            <p className="rx-read-text">{diagnosis}</p>
          )}
        </div>

        {/* Medicines Table */}
        <div className="rx-section">
          <div className="rx-section-header">
            <span className="rx-section-title">Prescribed Medications:</span>
            {!isViewOnly && (
              <button className="btn-add-med" onClick={addMedicineRow}>
                ➕ Add Medication
              </button>
            )}
          </div>

          <table className="rx-medicines-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                {!isViewOnly && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, i) => (
                <tr key={i}>
                  <td>
                    {!isViewOnly ? (
                      <input
                        type="text"
                        value={med.name}
                        placeholder="Medicine name"
                        onChange={(e) => updateMedicine(i, "name", e.target.value)}
                      />
                    ) : (
                      <strong>{med.name}</strong>
                    )}
                  </td>
                  <td>
                    {!isViewOnly ? (
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                      />
                    ) : (
                      med.dosage
                    )}
                  </td>
                  <td>
                    {!isViewOnly ? (
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => updateMedicine(i, "frequency", e.target.value)}
                      />
                    ) : (
                      <span className="badge-freq">{med.frequency}</span>
                    )}
                  </td>
                  <td>
                    {!isViewOnly ? (
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                      />
                    ) : (
                      med.duration
                    )}
                  </td>
                  {!isViewOnly && (
                    <td>
                      <button className="btn-del-med" onClick={() => removeMedicine(i)}>
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Doctor Advice Notes */}
        <div className="rx-section">
          <label className="rx-section-title">Special Instructions / Advice:</label>
          {!isViewOnly ? (
            <textarea
              rows="2"
              className="rx-textarea"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            ></textarea>
          ) : (
            <p className="rx-read-text">{advice}</p>
          )}
        </div>

        {/* Digital Signature & Footer */}
        <div className="rx-footer-bar">
          <div className="clinic-stamp-badge">
            <span>✅ Swastiq Verified E-Prescription</span>
          </div>

          <div className="doc-sign-block">
            <span className="sign-line">Dr. {appointment?.doctorName || "Specialist"}</span>
            <span className="sign-sub">Digital Sign-off Token</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="rx-modal-actions no-print">
          <button className="btn-hero-secondary" onClick={handlePrint}>
            🖨️ Print / Download PDF
          </button>
          {!isViewOnly && (
            <button className="btn-hero-primary" onClick={handleSave}>
              💾 Issue E-Prescription
            </button>
          )}
          <button className="btn-link" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
