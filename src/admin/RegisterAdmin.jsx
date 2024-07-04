import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Login.css";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const RegisterAdmin = () => {
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Admin" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Register Admin</h2>
          {success && (
            <div className="alert alert-success" role="alert">
              Registration successful. Please{" "}
              <Link to="/admin/login" className="alert-link">
                login
              </Link>{" "}
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
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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

export default RegisterAdmin;
