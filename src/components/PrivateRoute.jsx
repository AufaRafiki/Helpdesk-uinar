/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, navigateTo: NavigateTo, requiredRole }) => {
  const [cookies] = useCookies(["user"]);
  console.log(cookies);

  if (!cookies.user) {
    return <Navigate to={NavigateTo} />;
  }

  if (requiredRole && cookies.user.role !== requiredRole) {
    return <Navigate to={NavigateTo} />;
  }

  return <Component />;
};

export default PrivateRoute;
