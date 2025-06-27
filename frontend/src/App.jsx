import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PatientDashboard from "./PatientDashboard";
import "./App.css";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
    </Routes>
    <ToastContainer position="top-right"autoClose={3000}/>
    </>
  );
}

export default App;