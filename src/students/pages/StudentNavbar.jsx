/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import {
  query,
  orderBy,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import useAuth from "../../auth.js";
import { db } from "../../firebaseConfig";
import "./styles/StudentDashboard.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

// Navbar Component
const StudentNavbar = ( {activeLink: activeLink}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout functionality here
    removeCookie("user", { path: "/" }); // Make sure to specify the path if necessary
    navigate("/login");
    console.log("User logged out");
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom">
      <Container fluid>
        <div>
          <Navbar.Brand href="#">{activeLink}</Navbar.Brand>
          <Button variant="outline-light" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
          </Button>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              href="/dashboard"
              className={activeLink === "Dashboard" ? "active" : ""}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="/about"
              className={activeLink === "About" ? "active" : ""}
            >
              About
            </Nav.Link>
            <Nav.Link
              href="#contact"
              className={activeLink === "Contact" ? "active" : ""}
            >
              Contact Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default StudentNavbar