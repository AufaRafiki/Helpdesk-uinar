// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginMahasiswa from "./students/LoginMahasiswa";
import RegisterMahasiswa from "./students/RegisterMahasiswa";
import Logout from "./components/Logout";
import Dashboard from "./admin/Dashboard";
import FaktaPermasalahan from "./admin/FaktaPermasalahan";
import Kesimpulan from "./admin/Kesimpulan";
import Solusi from "./admin/Solusi";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import StudentDashboard from "./students/StudentDashboard";
import NotifikasiAdmin from "./admin/NotifikasiAdmin";
import LoginAdmin from "./admin/LoginAdmin";
import RegisterAdmin from "./admin/RegisterAdmin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginMahasiswa />} />
        <Route path="/register" element={<RegisterMahasiswa />} />
        <Route path="/logout" element={<Logout tujuan="/login" />} />
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

        <Route path="/admin/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />
        <Route
          path="/admin/logout"
          element={<Logout tujuan="/admin/login" />}
        />
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
        {/* Catch-all route to redirect to /dashboard */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
