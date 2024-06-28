/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import logo from "../../assets/logo-uinar.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Login.css";

const Login = () => {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, `${npm}@admin.com`, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: "admin",
        };
        setCookie("user", userData, { path: "/" });
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <h1>Admin</h1>
        </div>
        <div className="card p-5 shadow-sm" style={{ width: "100%" }}>
          <h2 className="card-title text-center mb-4">Login Admin</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                className="form-control bg-transparent mt-3"
                placeholder="ID Admin or NIDN"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <p>
                <a href="#">Forgot password?</a>
              </p>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Login
            </button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account yet?{" "}
            <Link to="/admin/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
