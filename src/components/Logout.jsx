/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Logout = ({ tujuan = "/login" }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user cookie and navigate to the specified page
    removeCookie("user", { path: "/" });
    navigate(tujuan);
    console.log("User logged out");
  }, [removeCookie, navigate]);

  return null; // Do not render anything
};

export default Logout;
