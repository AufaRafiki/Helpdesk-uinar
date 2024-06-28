import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./styles/Layout.css";

const Layout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    setIsLoggingOut(true);
  };

  const updateUnreadCount = (count) => {
    setUnreadCount(count);
  };

  return (
    <div className="layout">
      <Sidebar onLogout={handleLogout} unreadCount={unreadCount} />
      <div className="content">
        {isLoggingOut ? (
          <p>Logging out...</p>
        ) : (
          <Outlet context={{ updateUnreadCount }} />
        )}
      </div>
    </div>
  );
};

export default Layout;
