// components/LogoHeader.jsx
import React from "react";
import logo from "../assets/logo-uinar.png";

const LogoHeader = ({ role }) => {
  return (
    <div className="judul">
      <img
        src={logo}
        alt="Logo UIN Ar-Raniry"
        title="Logo UIN Ar-Raniry"
        width="200px"
      />
      <h1>Helpdesk UIN Ar-Raniry</h1>
      <h1>{role}</h1>
    </div>
  );
};

export default LogoHeader;
