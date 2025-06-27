import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
        setTimeout(() => {
          if (data.user.role === "patient") {
            navigate("/patient-dashboard");
          } else if (data.user.role === "doctor") {
            navigate("/doctor-dashboard");
          } else if (data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error(data.error || "Login failed!");
      }
    } catch (err) {
      toast.error("Server error.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;