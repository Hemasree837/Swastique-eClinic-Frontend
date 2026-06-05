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
    <div className="header">

      <div className="left">
        <img src={logo} alt="logo" />
        <h2>Swastiq eClinic</h2>
      </div>

      <div className="nav">
        <Link to="/">Home</Link>
        <Link to="/OurDoctors">Doctors</Link>
        <Link to="/BookAppointment">Book</Link>

        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}

        {user && (
          <>
            <span>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

    </div>
  );
}