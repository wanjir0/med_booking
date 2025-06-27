import React from "react";
import { Link } from "react-router-dom";


const Home = () => (
  <div className="home-root">
    {/* Header */}
    <header className="home-header">
      <div className="home-logo">MediBook</div>
      <nav>
        <Link to="/about" className="home-nav-link">About</Link>
        <Link to="/contact" className="home-nav-link">Contact</Link>
        <Link to="/register" className="home-nav-link">Register</Link>
        <Link to="/login" className="home-nav-link">Login</Link>
      </nav>
    </header>

    {/* Hero Section */}
    <section className="home-hero">
      <h1>Book a Medical Appointment Easily</h1>
      <p>Find top doctors and schedule your appointment in minutes.</p>
      <div className="home-cards">
        <div className="home-card">
          <span role="img" aria-label="appointment" className="home-card-emoji">📅</span>
          <h3>Book Appointment</h3>
          <p>Schedule a visit with a specialist in just a few clicks.</p>
          <button className="home-card-btn">Book Now</button>
        </div>
        <div className="home-card">
          <span role="img" aria-label="doctors" className="home-card-emoji">👨‍⚕️</span>
          <h3>Top Doctors</h3>
          <p>Browse our list of highly rated medical professionals.</p>
          <button className="home-card-btn">View Doctors</button>
        </div>
        <div className="home-card">
          <span role="img" aria-label="support" className="home-card-emoji">💬</span>
          <h3>Contact Support</h3>
          <p>Need help? Reach out to our support team anytime.</p>
          <button className="home-card-btn">Contact Us</button>
        </div>
      </div>
    </section>

    {/* Top Doctors */}
    <section className="home-doctors">
      <h2>Top Doctors</h2>
      <div className="home-doctors-list">
        <div className="home-doctor-card">
          <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="Dr. John Doe" className="home-doctor-img" />
          <h3>Dr. John Doe</h3>
          <p>Cardiologist</p>
        </div>
        <div className="home-doctor-card">
          <img src="https://randomuser.me/api/portraits/women/52.jpg" alt="Dr. Jane Smith" className="home-doctor-img" />
          <h3>Dr. Jane Smith</h3>
          <p>Pediatrician</p>
        </div>
        <div className="home-doctor-card">
          <img src="https://randomuser.me/api/portraits/men/43.jpg" alt="Dr. Mike Lee" className="home-doctor-img" />
          <h3>Dr. Mike Lee</h3>
          <p>Dermatologist</p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="home-footer">
      <div>MediBook &copy; {new Date().getFullYear()} | All rights reserved.</div>
      <div className="home-footer-links">
        <a href="#privacy" className="home-footer-link">Privacy Policy</a>
        <a href="#terms" className="home-footer-link">Terms of Service</a>
      </div>
    </footer>
  </div>
);

export default Home;

