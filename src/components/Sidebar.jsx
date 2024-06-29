/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./styles/Sidebar.css";

const Sidebar = ({ onLogout, unreadCount }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [hasUpdated, setHasUpdated] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setLoggingOut(true);
    onLogout();
    setTimeout(() => {
      navigate("/admin/logout");
    }, 500);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pengajuan"), (snapshot) => {
      const unreadCount = snapshot.docs.filter(
        (doc) => !doc.data().isRead
      ).length;
      setTotalUnread(unreadCount);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      setHasUpdated(true);
    }
  }, [unreadCount]);

  const getMenuItemClass = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };

  return (
    <div
      className={`sidebar ${
        isCollapsed
          ? "collapsed d-flex justify-content-start"
          : "d-flex justify-content-end"
      }`}
    >
      <button
        className="toggle-btn d-flex justify-content-start"
        onClick={toggleSidebar}
      >
        <span className="material-symbols-outlined">
          {isCollapsed ? "menu" : "close"}
        </span>
      </button>
      <div className="menu">
        <Link
          to="/admin/dashboard"
          className={getMenuItemClass("/admin/dashboard")}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="menu-text">Dashboard</span>
        </Link>
        <Link
          to="/admin/fakta-permasalahan"
          className={getMenuItemClass("/admin/fakta-permasalahan")}
        >
          <span className="material-symbols-outlined">report_problem</span>
          <span className="menu-text">Fact of the Problem</span>
        </Link>
        <Link
          to="/admin/kesimpulan"
          className={getMenuItemClass("/admin/kesimpulan")}
        >
          <span className="material-symbols-outlined">assessment</span>
          <span className="menu-text">Conclusion</span>
        </Link>
        <Link to="/admin/solusi" className={getMenuItemClass("/admin/solusi")}>
          <span className="material-symbols-outlined">lightbulb</span>
          <span className="menu-text">Solution</span>
        </Link>
      </div>
      <div className="menu notification">
        <Link
          to="/admin/notifikasi"
          className={`menu-item position-relative ${getMenuItemClass(
            "/admin/notifikasi"
          )}`}
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="menu-text">Notification</span>
          {totalUnread > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalUnread}
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
        </Link>
        <Link
          onClick={handleLogout}
          className={`menu-item position-relative logout ${getMenuItemClass(
            "/admin/logout"
          )}`}
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="menu-text">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
