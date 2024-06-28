/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "../students/styles/StudentDashboard.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const StudentNavbar = ({ activeLink }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      navigate("/logout");
    }, 500); // Delay for 1 second before navigating to /logout
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand href="#">{activeLink}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/dashboard" className={loggingOut ? "" : "active"}>
              Dashboard
            </Nav.Link>
            <Nav.Link
              onClick={handleLogout}
              className={loggingOut ? "active" : ""}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default StudentNavbar;
