import axios from "axios";
import { useEffect, useState } from "react";
import "./OurDoctors.css";

export default function OurDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:8080/doctor");
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = doctors.filter((d) =>
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h2>Our Doctors</h2>

      <input
        placeholder="Search specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid">

        {filtered.map((d) => (
          <div className="card" key={d.id}>

            <img
              src={d.imageUrl}
              alt={d.name}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/100")
              }
            />

            <h3>{d.name}</h3>
            <p>{d.specialization}</p>
            <p>{d.experience} years</p>

          </div>
        ))}

      </div>

    </div>
  );
}