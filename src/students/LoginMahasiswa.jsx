import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LogoHeader from "../components/LogoHeader";
import PasswordField from "../components/PasswordField";
import "bootstrap/dist/css/bootstrap.min.css";
import "../admin/styles/Login.css";
import ModalWarning from "../components/ModalWarning";

const LoginMahasiswa = () => {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, `${npm}@mhs.com`, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: "user",
        };
        setCookie("user", userData, { path: "/" });
        navigate("/dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleShowModal = () => setShowModal(true); // Function to show modal
  const handleCloseModal = () => setShowModal(false); // Function to close modal

  return (
    <div className="full-body">
      <div className="container">
        <LogoHeader role="Student" />
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Login</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                className="form-control bg-transparent mt-3"
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
              <p>
                <a href="#" onClick={handleShowModal}>
                  Forgot password?
                </a>
              </p>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Login
            </button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account yet? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      <ModalWarning
        show={showModal}
        handleClose={handleCloseModal}
        title="Forgot Password"
        message="Please contact the campus operator to reset your password."
      />
    </div>
  );
};

export default LoginMahasiswa;
