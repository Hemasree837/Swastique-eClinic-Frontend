import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api";
import "./Reporter.css";

export default function Reporter() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("all");

  const login = async () => {
    try {
      await axios.post(`${API}/auth/login`, { username, password });
      setLoggedIn(true);
      fetchDoctors();
    } catch {
      alert("Login failed");
    }
  };

  const fetchDoctors = async () => {
    const res = await axios.get(`${API}/doctor`);
    setDoctors(res.data);
  };

  const toggleLeave = async (id, status) => {
    await axios.put(`${API}/doctor/${id}/leave`, {
      onLeave: !status,
    });

    fetchDoctors();
  };

  const filteredDoctors = doctors.filter((d) => {
    if (filter === "leave") return d.onLeave;
    if (filter === "available") return !d.onLeave;
    return true;
  });

  if (!loggedIn) {
    return (
      <div className="login">

        <h2>Reporter Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

      </div>
    );
  }

  return (
    <div className="container">

      <h2>Reporter Panel</h2>

      {/* FILTER */}
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("available")}>Available</button>
        <button onClick={() => setFilter("leave")}>On Leave</button>
      </div>
      {filteredDoctors.map((d) => (
        <div className="card" key={d.id}>

          <img src={d.imageUrl} alt={d.name} />

          <h3>{d.name}</h3>
          <p>{d.specialization}</p>
          <p>{d.experience} yrs</p>

          <p>
            {d.onLeave ? "On Leave 🔴" : "Available 🟢"}
          </p>

          <button onClick={() => toggleLeave(d.id, d.onLeave)}>
            Toggle Status
          </button>

        </div>
      ))}

    </div>
  );
}