import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import "./Header.css";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">

      <Link to="/" className="left">
        <img src={logo} alt="Swastiq eClinic logo" />
        <span className="brand">Swastiq eClinic</span>
      </Link>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/OurDoctors">Doctors</Link>
        <Link to="/BookAppointment">Book</Link>

        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        {user?.role === "PATIENT" && <Link to="/patient">Dashboard</Link>}

        {!user && <Link className="btn-link" to="/login">Login</Link>}
        {!user && <Link className="btn-primary" to="/register">Register</Link>}

        {user && (
          <div className="user-area">
            <span className="greet">Hi, {user.username}</span>
            <button className="logout" onClick={logout}>Logout</button>
          </div>
        )}
      </nav>

    </header>
  );
}