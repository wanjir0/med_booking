import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{ fontFamily: "Arial, sans-serif" }}>
    {/* Header */}
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#1976d2", color: "#fff" }}>
      <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>MediBook</div>
      <nav>
        <Link to="/about" style={{ color: "#fff", margin: "0 1rem", textDecoration: "none" }}>About</Link>
        <Link to="/contact" style={{ color: "#fff", margin: "0 1rem", textDecoration: "none" }}>Contact</Link>
        <Link to="/register" style={{ color: "#fff", margin: "0 1rem", textDecoration: "none" }}>Register</Link>
        <Link to="/login" style={{ color: "#fff", margin: "0 1rem", textDecoration: "none" }}>Login</Link>
      </nav>
    </header>

    {/* Hero Section */}
    <section style={{ padding: "3rem 2rem", background: "#e3f2fd", textAlign: "center" }}>
      <h1>Book a Medical Appointment Easily</h1>
      <p>Find top doctors and schedule your appointment in minutes.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <div style={{ background: "#fff", padding: "2rem 1.5rem", borderRadius: "10px", boxShadow: "0 2px 12px #b3c6e0", width: "250px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span role="img" aria-label="appointment" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📅</span>
          <h3>Book Appointment</h3>
          <p>Schedule a visit with a specialist in just a few clicks.</p>
          <button style={{ marginTop: "1rem", padding: "0.7rem 1.5rem", background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer" }}>
            Book Now
          </button>
        </div>
        <div style={{ background: "#fff", padding: "2rem 1.5rem", borderRadius: "10px", boxShadow: "0 2px 12px #b3c6e0", width: "250px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span role="img" aria-label="doctors" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👨‍⚕️</span>
          <h3>Top Doctors</h3>
          <p>Browse our list of highly rated medical professionals.</p>
          <button style={{ marginTop: "1rem", padding: "0.7rem 1.5rem", background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer" }}>
            View Doctors
          </button>
        </div>
        <div style={{ background: "#fff", padding: "2rem 1.5rem", borderRadius: "10px", boxShadow: "0 2px 12px #b3c6e0", width: "250px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span role="img" aria-label="support" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</span>
          <h3>Contact Support</h3>
          <p>Need help? Reach out to our support team anytime.</p>
          <button style={{ marginTop: "1rem", padding: "0.7rem 1.5rem", background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", fontSize: "1rem", cursor: "pointer" }}>
            Contact Us
          </button>
        </div>
      </div>
    </section>

    {/* Top Doctors */}
    <section style={{ padding: "2rem 2rem" }}>
      <h2 style={{ textAlign: "center" }}>Top Doctors</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1.5rem" }}>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px #ccc", width: "200px" }}>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dr. John Doe" style={{ width: "100%", borderRadius: "50%" }} />
          <h3>Dr. John Doe</h3>
          <p>Cardiologist</p>
        </div>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px #ccc", width: "200px" }}>
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr. Jane Smith" style={{ width: "100%", borderRadius: "50%" }} />
          <h3>Dr. Jane Smith</h3>
          <p>Pediatrician</p>
        </div>
        <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 8px #ccc", width: "200px" }}>
          <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Dr. Mike Lee" style={{ width: "100%", borderRadius: "50%" }} />
          <h3>Dr. Mike Lee</h3>
          <p>Dermatologist</p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ background: "#1976d2", color: "#fff", textAlign: "center", padding: "1.5rem 2rem", marginTop: "2rem" }}>
      <div>MediBook &copy; {new Date().getFullYear()} | All rights reserved.</div>
      <div style={{ marginTop: "0.5rem" }}>
        <a href="#privacy" style={{ color: "#fff", textDecoration: "underline", marginRight: "1rem" }}>Privacy Policy</a>
        <a href="#terms" style={{ color: "#fff", textDecoration: "underline" }}>Terms of Service</a>
      </div>
    </footer>
  </div>
);

export default Home;

