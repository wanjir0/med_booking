import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [booking, setBooking] = useState({
    date: "",
    time: "",
    doctor_id: "",
    reason: "",
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientProfile, setPatientProfile] = useState({
    date_of_birth: "",
    gender: "",
    address: "",
    medical_history: "",
    emergency_contact: "",
  });
  const [profileMsg, setProfileMsg] = useState("");

  // Fetch doctors for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => setDoctors([]));
  }, []);

  // Fetch appointments and patients on mount or tab change
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetch(`http://localhost:5000/api/appointments?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .catch(() => setAppointments([]));

      fetch(`http://localhost:5000/api/patients?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => setPatients(data))
        .catch(() => setPatients([]));
    }
  }, [activeTab]);

  // Fetch existing patient profile when Profile tab is active
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (activeTab === "profile" && user && user.id) {
      fetch(`http://localhost:5000/api/patient/profile?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) setPatientProfile(data);
        });
    }
  }, [activeTab]);

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      toast.error("User not logged in.");
      return;
    }
    // Send doctor_id, not doctor name
    const bookingData = { ...booking, user_id: user.id };
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Appointment booked!");
        setBooking({ date: "", time: "", doctor_id: "", reason: "" });
        setAppointments((prev) => [...prev, data.appointment]);
        setActiveTab("appointments");
      } else {
        toast.error(data.error || "Booking failed.");
      }
    } catch (err) {
      toast.error("Server error.");
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Appointment cancelled.");
        setAppointments(appointments.filter((app) => app.id !== id));
      } else {
        toast.error(data.error || "Cancel failed.");
      }
    } catch (err) {
      toast.error("Server error.");
    }
  };

  const handlePatientProfileChange = (e) => {
    setPatientProfile({ ...patientProfile, [e.target.name]: e.target.value });
  };

  const handlePatientProfileSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setProfileMsg("User not logged in.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/patient/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patientProfile, user_id: user.id }),
      });
      const data = await res.json();
      if (res.ok) setProfileMsg("Profile saved!");
      else setProfileMsg(data.error || "Profile save failed.");
    } catch {
      setProfileMsg("Server error.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Patient</h2>
        <nav>
          <ul>
            <li
              className={activeTab === "welcome" ? "active" : ""}
              onClick={() => setActiveTab("welcome")}
            >
              Dashboard
            </li>
            <li
              className={activeTab === "appointments" ? "active" : ""}
              onClick={() => setActiveTab("appointments")}
            >
              Upcoming Appointments
            </li>
            <li
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </li>
            <li
              className={activeTab === "book" ? "active" : ""}
              onClick={() => setActiveTab("book")}
            >
              Book Appointment
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === "welcome" && (
          <div className="welcome-card">
            <h2>Welcome😊</h2>
            <p>Manage your appointments and profile from your dashboard.</p>
            <button
              className="book-btn"
              onClick={() => setActiveTab("book")}
            >
              Book New Appointment
            </button>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="appointments-list">
            <h2>Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <ul>
                {appointments.map((app) => (
                  <li key={app.id}>
                    <span className="appointment-info">
                      <span className="icon">📅</span>
                      {app.date} {app.time} with Dr. {app.doctor_name} - {app.reason}
                      <span className="status-badge">{app.status || "Scheduled"}</span>
                    </span>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelAppointment(app.id)}
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2>Your Patient Profile</h2>
            <form className="profile-form" onSubmit={handlePatientProfileSubmit}>
              <label>
                Date of Birth:
                <input
                  type="date"
                  name="date_of_birth"
                  value={patientProfile.date_of_birth}
                  onChange={handlePatientProfileChange}
                  required
                />
              </label>
              <label>
                Gender:
                <select
                  name="gender"
                  value={patientProfile.gender}
                  onChange={handlePatientProfileChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={patientProfile.address}
                  onChange={handlePatientProfileChange}
                  required
                />
              </label>
              <label>
                Medical History:
                <textarea
                  name="medical_history"
                  value={patientProfile.medical_history}
                  onChange={handlePatientProfileChange}
                ></textarea>
              </label>
              <label>
                Emergency Contact:
                <input
                  type="text"
                  name="emergency_contact"
                  value={patientProfile.emergency_contact}
                  onChange={handlePatientProfileChange}
                />
              </label>
              <button type="submit" className="book-btn">
                Save Profile
              </button>
              {profileMsg && <p>{profileMsg}</p>}
            </form>
          </div>
        )}

        {activeTab === "book" && (
          <div>
            <h2>Book an Appointment</h2>
            <form className="booking-form" onSubmit={handleBookAppointment}>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={booking.date}
                  onChange={handleBookingChange}
                  required
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  name="time"
                  value={booking.time}
                  onChange={handleBookingChange}
                  required
                />
              </label>
              <label>
                Doctor:
                <select
                  name="doctor_id"
                  value={booking.doctor_id}
                  onChange={handleBookingChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Reason:
                <textarea
                  name="reason"
                  placeholder="Reason for appointment"
                  value={booking.reason}
                  onChange={handleBookingChange}
                  required
                ></textarea>
              </label>
              <button type="submit" className="book-btn">
                Book Appointment
              </button>
            </form>
          </div>
        )}

        {activeTab === "patients" && (
          <div>
            <h2>Patients List</h2>
            {Array.isArray(patients) && patients.length === 0 ? (
              <p>No patient records found.</p>
            ) : Array.isArray(patients) ? (
              <ul>
                {patients.map((p) => (
                  <li key={p.id}>
                    {p.name} - {p.email} - {p.phone}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;