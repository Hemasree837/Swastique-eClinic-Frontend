import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api";
import "./Patient.css";

export default function Patient({ user }) {
  const name = user?.username;

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState("");
  const [tab, setTab] = useState("doctors");

  useEffect(() => {
    loadDoctors();
    loadAppointments();
  }, []);

  const loadDoctors = async () => {
    const res = await axios.get(`${API}/doctor`);
    setDoctors(res.data);
  };

  const loadAppointments = async () => {
    const res = await axios.get(`${API}/appointment`);
    const mine = res.data.filter((a) => a.patientName === name);
    setAppointments(mine);
  };

  const book = async () => {
    if (!selectedDoctor || !slot || !date) {
      alert("Fill all fields");
      return;
    }

    await axios.post(`${API}/appointment`, {
      patientName: name,
      doctorName: selectedDoctor.name,
      date,
      time: slot,
      status: "PENDING",
    });

    alert("Booked!");
    setSelectedDoctor(null);
    setSlot("");
    setDate("");
    loadAppointments();
    setTab("appointments");
  };

  return (
    <div className="container">

      <h2>Welcome {name}</h2>
      <div className="tabs">
        <button onClick={() => setTab("doctors")}>Doctors</button>
        <button onClick={() => setTab("appointments")}>My Appointments</button>
      </div>
      {tab === "doctors" && (
        <div className="grid">

          {doctors
            .filter((d) => !d.onLeave)
            .map((d) => (
              <div className="card" key={d.id}>

                <img src={d.imageUrl} alt={d.name} />

                <h3>{d.name}</h3>
                <p>{d.specialization}</p>
                <p>{d.experience} yrs</p>

                <input type="date" onChange={(e) => setDate(e.target.value)} />

                <div>
                  {d.availableSlots?.map((s, i) => (
                    <button key={i} onClick={() => {
                      setSelectedDoctor(d);
                      setSlot(s);
                    }}>
                      {s}
                    </button>
                  ))}
                </div>

                <button onClick={book}>Book</button>

              </div>
            ))}
        </div>
      )}
      {tab === "appointments" && (
        <div>

          {appointments.map((a) => (
            <div key={a.id} className="card">
              <p>{a.doctorName}</p>
              <p>{a.date} - {a.time}</p>
              <p>{a.status}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}