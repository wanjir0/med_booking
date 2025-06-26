import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Add this line

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful!");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 1000); // Optional: short delay to show message
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (err) {
      setMessage("Server error.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <div style={{ marginTop: "1rem", color: "red" }}>{message}</div>}
    </div>
  );
};

export default Register;