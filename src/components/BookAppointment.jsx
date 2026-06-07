import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookAppointment.css";

function BookAppointment() {
  const navigate = useNavigate();

  const API = "https://swastique-eclinic-backend.onrender.com/appointment";

  const user = JSON.parse(localStorage.getItem("user"));
  const loggedIn = !!user;

  useEffect(() => {
    if (!loggedIn) navigate("/login");
  }, [loggedIn, navigate]);

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [date, setDate] = useState("");

  const [patientName, setPatientName] = useState("");

const [step, setStep] = useState(1);

  const clinicInfo = {
    supportPhone: "+91 98765 43210",
    supportEmail: "support@swastiqueclinic.com",
    address: "123, Wellness Street, City, India",
    hours: "Mon - Sat, 9:00 AM - 6:00 PM",
  };

  useEffect(() => {
    fetchDoctors();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setPatientName(user.username);
    }
  }, []);

  const fetchDoctors = async () => {
    try {

      const res = await axios.get(`${API}/doctor`);


      const availableDoctors = res.data.filter(
        d => !d.onLeave
      );

      setDoctors(availableDoctors);

    } catch (err) {
      console.log(err);
      alert("Backend connection error");
    }

    setLoading(false);
  };

const bookAppointment = async () => {
  console.log(selectedDoctor, selectedSlot, date);

  try {
    const res = await axios.post(`${API}/appointment`, {
      patientName,
      doctorName: selectedDoctor.name,
      date,
      time: selectedSlot,
      status: "PENDING"
    });

    console.log(res.data);
    setStep(2);

  } catch (err) {
    console.log("BOOKING ERROR:", err.response || err.message);
    alert("Booking failed");
  }
};
  const handleReset = () => {
    setSelectedDoctor(null);
    setSelectedSlot("");
    setDate("");
    setStep(1);
  };

  return (
    <div className="book-container">

      <h2 className="book-title">
        Book Appointment
      </h2>
      {step === 1 && (
        <>

          {/* Clinic info */}
          <div className="clinic-info">
            <div className="clinic-info-card">
              <h3>Need help?</h3>
              <p className="muted">Contact our support team for any appointment-related questions.</p>

              <div className="clinic-grid">
                <div>
                  <p className="label">Phone</p>
                  <p className="value">{clinicInfo.supportPhone}</p>
                </div>
                <div>
                  <p className="label">Email</p>
                  <p className="value">{clinicInfo.supportEmail}</p>
                </div>
                <div>
                  <p className="label">Address</p>
                  <p className="value">{clinicInfo.address}</p>
                </div>
                <div>
                  <p className="label">Hours</p>
                  <p className="value">{clinicInfo.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <p>Loading doctors...</p>
          )}

          {!loading && doctors.length === 0 && (
            <p>No doctors available.</p>
          )}

          <div className="doctor-grid">

            {doctors.map((doc) => (

              <div
                key={doc.id}
                className={
                  selectedDoctor?.id === doc.id
                    ? "doctor-card active"
                    : "doctor-card"
                }
              >

                <img
                  src={
                    doc.imageUrl ||
                    "https://via.placeholder.com/100"
                  }
                  alt={doc.name}
                  className="doctor-img"
                />

                <h3>{doc.name}</h3>

                <p className="spec">
                  {doc.specialization}
                </p>

                <p className="exp">
                  {doc.experience} yrs experience
                </p>

                <button
                  className="select-btn"
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setSelectedSlot("");
                  }}
                >
                  Select Doctor
                </button>
                {selectedDoctor?.id === doc.id && (
                  <div className="slots-wrap">

                    <h4>Select Slot</h4>

                    <div className="slots">

                      {doc.availableSlots?.map((slot) => (

                        <button
                          key={slot}
                          className={
                            selectedSlot === slot
                              ? "slot active-slot"
                              : "slot"
                          }
                          onClick={() =>
                            setSelectedSlot(slot)
                          }
                        >
                          {slot}
                        </button>

                      ))}

                    </div>

                    <input
                      type="date"
                      className="date-input"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                    />

                  </div>
                )}

              </div>

            ))}

          </div>

          {selectedDoctor &&
            selectedSlot &&
            date && (

            <div className="summary">

              <h3>Appointment Summary</h3>

              <p>
                <b>Patient:</b> {patientName}
              </p>

              <p>
                <b>Doctor:</b> {selectedDoctor.name}
              </p>

              <p>
                <b>Specialization:</b>{" "}
                {selectedDoctor.specialization}
              </p>

              <p>
                <b>Date:</b> {date}
              </p>

              <p>
                <b>Time:</b> {selectedSlot}
              </p>

              <button
                className="confirm-btn"
                onClick={bookAppointment}
              >
                Confirm Appointment
              </button>

            </div>
          )}

        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (

        <div className="success-box">

          <h2>
            ✅ Appointment Request Sent
          </h2>

          <p>
            Admin will review and approve your appointment.
          </p>

          <button onClick={handleReset}>
            Book Another
          </button>

        </div>

      )}

    </div>
  );
}

export default BookAppointment;