import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./styles/Sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    removeCookie("user", { path: "/" }); // Make sure to specify the path if necessary
    navigate("/admin/login");
  };

  const getMenuItemClass = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };

  const fetchUnreadNotifications = async () => {
    try {
      const q = query(
        collection(db, "pengajuan"),
        where("isRead", "==", false)
      );
      const querySnapshot = await getDocs(q);
      setUnreadCount(querySnapshot.size);
    } catch (e) {
      console.error("Error fetching unread notifications: ", e);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

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
          <span className="menu-text">Fakta Permasalahan</span>
        </Link>
        <Link
          to="/admin/kesimpulan"
          className={getMenuItemClass("/admin/kesimpulan")}
        >
          <span className="material-symbols-outlined">assessment</span>
          <span className="menu-text">Kesimpulan</span>
        </Link>
        <Link to="/admin/solusi" className={getMenuItemClass("/admin/solusi")}>
          <span className="material-symbols-outlined">lightbulb</span>
          <span className="menu-text">Solusi</span>
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
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
        </Link>
      </div>
      <div className="menu logout">
        <button className="menu-item" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
