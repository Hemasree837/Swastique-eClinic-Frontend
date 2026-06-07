import bg from "../assets/bg.jpg";
import AnnouncementMarquee from "./AnnouncementMarquee";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <span className="badge">Swastiq eClinic</span>
          <h1>
            Your trusted first stop to
            <br />
            <span className="em">better health</span>
          </h1>
          <p className="lead">
            Access modern primary care 24x7 and get protected with comprehensive services
            at pocket-friendly prices. Schedule appointments, consult with specialists,
            and manage your health from one simple dashboard.
          </p>

          <div className="hero-cta">
            <a className="cta-primary" href="/login">Consult Our Doctors</a>
            <a className="cta-secondary" href="/OurDoctors">Explore Our Plans</a>
          </div>

          <div className="hero-image">
            <img src={bg} alt="Clinic" />
          </div>
        </div>
      </section>

      <AnnouncementMarquee />

      <div className="features">
        <div className="feature">
          <h3>Doctor Availability</h3>
          <p>See who’s available and choose a slot instantly.</p>
        </div>
        <div className="feature">
          <h3>Appointment Requests</h3>
          <p>Send requests that admins approve quickly.</p>
        </div>
        <div className="feature">
          <h3>Easy Patient Panel</h3>
          <p>Track your appointments from your dashboard.</p>
        </div>
      </div>
    </div>
  );
}
