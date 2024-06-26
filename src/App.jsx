// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./admin/pages/Login";
import LoginMahasiswa from "./students/pages/LoginMahasiswa";
import RegisterMahasiswa from "./students/pages/RegisterMahasiswa";
import Register from "./admin/pages/Register";
import Dashboard from "./admin/pages/Dashboard";
import FaktaPermasalahan from "./admin/pages/FaktaPermasalahan";
import Kesimpulan from "./admin/pages/Kesimpulan";
import Solusi from "./admin/pages/Solusi";
import Layout from "./admin/components/Layout";
import PrivateRoute from "./admin/components/PrivateRoute";
import StudentDashboard from "./students/pages/StudentDashboard";
import About from "./students/pages/About";
import NotifikasiAdmin from "./admin/pages/NotifikasiAdmin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginMahasiswa />} />
        <Route path="/register" element={<RegisterMahasiswa />} />
        {/* <Route
          path="/"
          element={<PrivateRoute component={Layout} navigateTo="/login" />}
        ></Route> */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              component={StudentDashboard}
              navigateTo="/login"
              requiredRole="user"
            />
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute
              component={About}
              navigateTo="/login"
              requiredRole="user"
            />
          }
        />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route
          path="/admin/"
          element={
            <PrivateRoute
              component={Layout}
              navigateTo="/admin/login"
              requiredRole="admin"
            />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fakta-permasalahan" element={<FaktaPermasalahan />} />
          <Route path="kesimpulan" element={<Kesimpulan />} />
          <Route path="solusi" element={<Solusi />} />
          <Route path="notifikasi" element={<NotifikasiAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
