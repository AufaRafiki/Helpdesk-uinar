// src/components/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-uinar.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Login.css";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const Register = () => {
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk melacak apakah password ditampilkan atau tidak

  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, `${npm}@admin.com`, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Simpan data pengguna ke Firestore
        addDoc(collection(db, "admin"), {
          uid: user.uid,
          nama: nama,
          npm: npm,
        })
          .then(() => {
            console.log("User registered:", user);
            setSuccess(true);
          })
          .catch((error) => {
            console.error("Error saving user data to Firestore:", error);
            setError(error.message);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Mengubah nilai state showPassword menjadi kebalikannya
  };

  return (
    <div className="full-body">
      <div className="container">
        <div className="judul">
          <img
            src={logo}
            alt="Logo UIN Ar-Raniry"
            title="Logo UIN Ar-Raniry"
            width="200px"
          />
          <h1>Helpdesk UIN Ar-Raniry</h1>
        </div>
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Register Admin</h2>
          {success && (
            <div className="alert alert-success" role="alert">
              Registration successful. Please{" "}
              <a href="/admin/login" className="alert-link">
                login
              </a>{" "}
              to continue
            </div>
          )}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                className="form-control bg-transparent mt-3"
                placeholder="Full Name"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control bg-transparent"
                placeholder="ID Student or NPM"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="input-group">
                {" "}
                {/* Tambahkan input group untuk menampilkan tombol mata */}
                <input
                  type={showPassword ? "text" : "password"} // Gunakan ternary operator untuk menentukan tipe input
                  className="form-control bg-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary" // Tambahkan kelas untuk styling tombol mata
                  type="button" // Tentukan tipe button agar tidak melakukan submit form
                  onClick={togglePasswordVisibility} // Panggil fungsi ketika tombol mata ditekan
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Register
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/admin/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
