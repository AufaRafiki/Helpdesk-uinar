/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// Layout.jsx
import React from "react";
import { Container } from "react-bootstrap";
import StudentNavbar from "./StudentNavbar";

const LayoutMahasiswa = ({ children }) => {
  return (
    <div>
      <StudentNavbar />
      <Container>{children}</Container>
    </div>
  );
};

export default LayoutMahasiswa;
