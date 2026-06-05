import axios from "axios";
import { useEffect, useState } from "react";

export default function Admin() {
  const API = "http://localhost:8080";

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
    const res = await axios.get(`${API}/doctor`);
    setDoctors(res.data);
  };

  const fetchAppointments = async () => {
    const res = await axios.get(`${API}/appointment`);
    setAppointments(res.data);
  };

  const addDoctor = async () => {
    if (
      !name ||
      !spec ||
      !experience ||
      !slots ||
      !imageUrl
    ) {
      alert("Fill all fields");
      return;
    }

    await axios.post(`${API}/doctor`, {
      name,
      specialization: spec,
      experience,
      imageUrl,
      availableSlots: slots.split(","),
      onLeave: false,
    });

    clearForm();
    fetchDoctors();
  };

  const updateDoctor = async () => {
    await axios.put(`${API}/doctor/${editId}`, {
      name,
      specialization: spec,
      experience,
      imageUrl,
      availableSlots: slots.split(","),
    });

    clearForm();
    setEditId(null);
    fetchDoctors();
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete doctor?")) return;

    await axios.delete(`${API}/doctor/${id}`);
    fetchDoctors();
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

            <p>
              Total Doctors : {doctors.length}
            </p>

            <p>
              Total Appointments : {appointments.length}
            </p>
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
                placeholder="Image URL"
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

            <hr />

            {doctors.map((d) => (
              <div className="card" key={d.id}>

                <img
                  src={d.imageUrl}
                  alt={d.name}
                  width="100"
                  height="100"
                />

                <h3>{d.name}</h3>

                <p>{d.specialization}</p>

                <p>
                  {d.experience} Years Experience
                </p>

                <p>
                  {d.onLeave
                    ? "🔴 On Leave"
                    : "🟢 Available"}
                </p>

                <p>
                  Slots :
                  {" "}
                  {d.availableSlots?.join(", ")}
                </p>

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
            ))}

          </div>
        )}

        {tab === "appointments" && (
          <div>

            <h2>Appointments</h2>

            {appointments.length === 0 ? (
              <p>No appointments found</p>
            ) : (
              appointments.map((a) => (
                <div
                  className="card"
                  key={a.id}
                >
                  <h4>{a.patientName}</h4>

                  <p>
                    Doctor :
                    {" "}
                    {a.doctorName}
                  </p>

                  <p>
                    Date :
                    {" "}
                    {a.date}
                  </p>

                  <p>
                    Time :
                    {" "}
                    {a.time}
                  </p>

                  <p>
                    Status :
                    {" "}
                    {a.status}
                  </p>
                </div>
              ))
            )}

          </div>
        )}

      </div>

    </div>
  );
}