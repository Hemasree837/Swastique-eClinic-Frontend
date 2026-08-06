import axios from "axios";
import { useEffect, useState } from "react";
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
    />
  );
}

export default function OurDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    try {
      const res = await axios.get(`${API}/doctor`);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = doctors.filter((d) =>
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <div>
          <h2>Our Doctors</h2>
          <p>Browse our specialist doctors and choose the right care for your needs.</p>
        </div>

        <div className="search-box">
          <input
            placeholder="Search specialization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="doctors-grid">
        {filtered.map((d) => (
          <article className="doctor-card" key={d.id}>
            <div className="doctor-avatar">
              <DoctorAvatar name={d.name} src={d.imageUrl} />
            </div>

            <div className="doctor-info">
              <h3>{d.name}</h3>
              <span className="specialty">{d.specialization || "General Practice"}</span>
              <p className="experience">{d.experience || "0"} years experience</p>
              <p className="slots">Slots: {(d.availableSlots && d.availableSlots.length) ? d.availableSlots.join(", ") : "N/A"}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}