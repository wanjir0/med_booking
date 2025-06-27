import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [booking, setBooking] = useState({
    date: "",
    time: "",
    doctor: "",
    reason: "",
  });
  const [appointments, setAppointments] = useState([]);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    address: "",
    phone: "",
    gender: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);

  // Fetch appointments when component mounts or after booking/cancelling
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetch(`http://localhost:5000/api/appointments?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .catch(() => setAppointments([]));
    }
  }, [activeTab]); // re-fetch when switching to appointments tab

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
        setBooking({ date: "", time: "", doctor: "", reason: "" });
        // Refresh appointments
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

  // Profile handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditProfile = () => setEditingProfile(true);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("User not logged in.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, user_id: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profile saved!");
        setEditingProfile(false);
      } else {
        alert(data.error || "Profile save failed.");
      }
    } catch (err) {
      alert("Server error.");
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
                    <span>
                      {app.date} {app.time} with Dr. {app.doctor} - {app.reason}
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
            <h2>Your Profile</h2>
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  required
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  required
                />
              </label>
              <label>
                Gender:
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                  disabled={!editingProfile}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              {editingProfile ? (
                <button type="submit" className="book-btn">Save</button>
              ) : (
                <button type="button" className="book-btn" onClick={handleEditProfile}>
                  Edit
                </button>
              )}
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
                <input
                  type="text"
                  name="doctor"
                  placeholder="Doctor's Name"
                  value={booking.doctor}
                  onChange={handleBookingChange}
                  required
                />
              </label>
              <label>
                Reason:
                <textarea
                  name="reason"
                  placeholder="Reason for appointment"
                  value={booking.reason}
                  onChange={handleBookingChange}
                  required
                />
              </label>
              <button type="submit" className="book-btn">Book Appointment</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;