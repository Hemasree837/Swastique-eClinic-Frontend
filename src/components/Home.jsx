import bg from "../assets/bg.jpg";
import AnnouncementMarquee from "./AnnouncementMarquee";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">

      <h1>Welcome to Swastiq eClinic</h1>
      <p>Book appointments easily with doctors</p>

      <img src={bg} alt="Clinic" />

      <AnnouncementMarquee />

    </div>
  );
}