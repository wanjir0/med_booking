import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";


const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [patients, setPatients] = useState([]);

  // Fetch today's appointments, notifications, patients, and profile
  useEffect(() => {
    const doctor = JSON.parse(localStorage.getItem("user"));
    if (doctor && doctor.id) {
      // Today's appointments
      fetch(`http://localhost:5000/api/doctor/appointments?doctor_id=${doctor.id}`)
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .catch(() => setAppointments([]));

      // Notifications
      fetch(`http://localhost:5000/api/doctor/notifications?doctor_id=${doctor.id}`)
        .then((res) => res.json())
        .then((data) => setNotifications(Array.isArray(data) ? data : []))
        .catch(() => setNotifications([]));

      // Patients
      fetch(`http://localhost:5000/api/doctor/patients?doctor_id=${doctor.id}`)
        .then((res) => res.json())
        .then((data) => setPatients(Array.isArray(data) ? data : []))
        .catch(() => setPatients([]));

      // Profile (only when Profile tab is active)
      if (activeTab === "profile") {
        fetch(`http://localhost:5000/api/doctor/profile?doctor_id=${doctor.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && Object.keys(data).length > 0) setProfile(data);
          })
          .catch(() => {});
      }
    }
  }, [activeTab]);

  // Fetch upcoming appointments when the tab or doctor changes
  useEffect(() => {
    const doctor = JSON.parse(localStorage.getItem("user"));
    if (activeTab === "appointments" && doctor && doctor.id) {
      fetch(`http://localhost:5000/api/doctor/upcoming?doctor_id=${doctor.id}`)
        .then(res => res.json())
        .then(data => setUpcomingAppointments(Array.isArray(data) ? data : []))
        .catch(() => setUpcomingAppointments([]));
    }
  }, [activeTab]);

  // Profile handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleEditProfile = () => setEditingProfile(true);
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const doctor = JSON.parse(localStorage.getItem("user"));
    if (!doctor || !doctor.id) {
      toast.error("User not logged in.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/doctor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, doctor_id: doctor.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile saved!");
        setEditingProfile(false);
      } else {
        toast.error(data.error || "Profile save failed.");
      }
    } catch (err) {
      toast.error("Server error.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Doctor</h2>
        <nav>
          <ul>
            <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li className={activeTab === "schedule" ? "active" : ""} onClick={() => setActiveTab("schedule")}>Schedule</li>
            <li className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>Upcoming Appointments</li>
            <li className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>Patient Records</li>
            <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === "dashboard" && (
          <div>
            <h2>Today's Appointments</h2>
            {appointments.length === 0 ? (
              <p>No appointments for today.</p>
            ) : (
              <ul>
                {appointments.map((app) => (
                  <li key={app.id}>
                    {app.time} - {app.patient_name} ({app.reason})
                  </li>
                ))}
              </ul>
            )}
            <h3 style={{ marginTop: "2rem" }}>Notifications</h3>
            {notifications.length === 0 ? (
              <p>No new notifications.</p>
            ) : (
              <ul>
                {notifications.map((note, idx) => (
                  <li key={idx}>{note.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div>
            <h2>My Schedule</h2>
            {/* Add schedule management here */}
            <p>Schedule management coming soon...</p>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="upcoming-appointments-list">
            <h2>Upcoming Appointments</h2>
            {Array.isArray(upcomingAppointments) && upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : Array.isArray(upcomingAppointments) ? (
              <ul>
                {upcomingAppointments.map((app) => (
                  <li key={app.id}>
                    <span className="appointment-info">
                      <span className="icon">📅</span>
                      {app.date} {app.time} with {app.patient_name} - {app.reason}
                      <span className="status-badge">{app.status || "Scheduled"}</span>
                    </span>
                    <div className="appointment-actions">
                      {app.status !== "Completed" && (
                        <button
                          onClick={async () => {
                            const res = await fetch(`http://localhost:5000/api/appointments/${app.id}/complete`, {
                              method: "POST",
                            });
                            const data = await res.json();
                            if (res.ok) {
                              // Update UI
                              setUpcomingAppointments((prev) =>
                                prev.map((a) =>
                                  a.id === app.id ? { ...a, status: "Completed" } : a
                                )
                              );
                              toast.success("Appointment marked as completed.");
                            } else {
                              toast.error(data.error || "Could not mark as completed.");
                            }
                          }}
                          className="book-btn"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}

        {activeTab === "patients" && (
          <div>
            <h2>Patient Records</h2>
            {patients.length === 0 ? (
              <p>No patient records found.</p>
            ) : (
              <ul>
                {patients.map((p) => (
                  <li key={p.id}>
                    {p.name} - {p.email} - {p.phone}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2>Your Profile</h2>
            <div className="profile-details">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Specialty:</strong> {profile.specialty}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <button type="button" className="book-btn" onClick={handleEditProfile}>
                Edit
              </button>
            </div>
            {editingProfile && (
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
                  Specialty:
                  <input
                    type="text"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    required
                  />
                </label>
                <label>
                  Phone:
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
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    required
                  />
                </label>
                <button type="submit" className="book-btn">Save</button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;

