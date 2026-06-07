import axios from "axios";
import { useEffect, useState } from "react";

export default function Admin() {
 const API = import.meta.env.VITE_API_URL || "https://swastique-eclinic-backend.onrender.com";

  const [tab, setTab] = useState("dashboard");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [experience, setExperience] = useState("");
  const [slots, setSlots] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctor`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      alert("Failed to fetch doctors");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/appointment`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      alert("Failed to fetch appointments");
    }
  };

  const addDoctor = async () => {
    if (!name || !spec || !experience || !slots) {
      alert("Please fill in name, specialization, experience and slots.");
      return;
    }

    try {
      await axios.post(`${API}/doctor`, {
        name,
        specialization: spec,
        experience,
        imageUrl,
        availableSlots: slots.split(","),
        onLeave: false,
      });
      alert("Doctor added successfully!");
      clearForm();
      fetchDoctors();
    } catch (err) {
      console.error("Error adding doctor:", err);
      alert("Failed to add doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const updateDoctor = async () => {
    try {
      await axios.put(`${API}/doctor/${editId}`, {
        name,
        specialization: spec,
        experience,
        imageUrl,
        availableSlots: slots.split(","),
      });
      alert("Doctor updated successfully!");
      clearForm();
      setEditId(null);
      fetchDoctors();
    } catch (err) {
      console.error("Error updating doctor:", err);
      alert("Failed to update doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete doctor?")) return;

    try {
      await axios.delete(`${API}/doctor/${id}`);
      alert("Doctor deleted successfully!");
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert("Failed to delete doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const clearForm = () => {
    setName("");
    setSpec("");
    setExperience("");
    setSlots("");
    setImageUrl("");
  };

  return (
    <div className="container">

      <div className="sidebar">
        <button onClick={() => setTab("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setTab("doctors")}>
          Doctors
        </button>

        <button onClick={() => setTab("appointments")}>
          Appointments
        </button>
      </div>

      <div className="main">

        {tab === "dashboard" && (
          <div>
            <h2>Dashboard</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Doctors</h3>
                <div className="value">{doctors.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Appointments</h3>
                <div className="value">{appointments.length}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "doctors" && (
          <div>

            <h2>Manage Doctors</h2>

            <div className="form">

              <input
                placeholder="Doctor Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <input
                placeholder="Specialization"
                value={spec}
                onChange={(e) =>
                  setSpec(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Experience"
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
              />

              <input
                placeholder="Slots (9AM,1PM,4PM)"
                value={slots}
                onChange={(e) =>
                  setSlots(e.target.value)
                }
              />

              <input
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
              />

              {editId ? (
                <>
                  <button onClick={updateDoctor}>
                    Update Doctor
                  </button>

                  <button
                    onClick={() => {
                      setEditId(null);
                      clearForm();
                    }}
                    style={{ background: "rgba(239, 68, 68, 0.1)", color: "#dc2626" }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={addDoctor}>
                  Add Doctor
                </button>
              )}
            </div>

            <div className="doctors-list">
              {doctors.map((d) => (
                <div className="card" key={d.id}>
                  <div style={{ textAlign: "center" }}>
                    <div className="admin-avatar">
                      {d.imageUrl ? (
                        <img
                          src={d.imageUrl}
                          alt={d.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="admin-initials">{d.name?.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
                      )}
                    </div>
                    <h3>{d.name}</h3>
                    <p style={{ color: "var(--accent)", fontWeight: "600", margin: "8px 0 12px 0" }}>{d.specialization}</p>
                  </div>

                  <p><strong>Experience:</strong> {d.experience} Years</p>

                  <p>
                    {d.onLeave
                      ? "🔴 On Leave"
                      : "🟢 Available"}
                  </p>

                  <p><strong>Slots:</strong> {d.availableSlots?.join(", ")}</p>

                  <div className="card-actions">
                    <button
                      onClick={() => {
                        setName(d.name);
                        setSpec(d.specialization);
                        setExperience(d.experience);
                        setSlots(
                          d.availableSlots?.join(",")
                        );
                        setImageUrl(d.imageUrl);
                        setEditId(d.id);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteDoctor(d.id)
                      }
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {tab === "appointments" && (
          <div>
            <h2>Appointments</h2>

            {appointments.length === 0 ? (
              <div className="empty-state">
                <p>No appointments found</p>
              </div>
            ) : (
              <div className="appointments-table">
                <div className="appointments-header">
                  <div>Patient Name</div>
                  <div>Doctor Name</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Status</div>
                </div>
                {appointments.map((a) => (
                  <div className="appointment-item" key={a.id}>
                    <p><strong>{a.patientName}</strong></p>
                    <p>{a.doctorName}</p>
                    <p>{a.date}</p>
                    <p>{a.time}</p>
                    <div className="status-badge">{a.status}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}