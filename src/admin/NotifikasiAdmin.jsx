/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import ModalCRUD from "../components/ModalCRUD";
import ToastHelpdesk from "../components/ToastHelpdesk";
import "./styles/NotifikasiAdmin.css";

const NotifikasiAdmin = () => {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState("");
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [error, setError] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef(null);

  const { updateUnreadCount } = useOutletContext();

  const handleClose = () => {
    setModalShow(false);
    setDescription("");
    setError("");
  };

  const handleAddShow = (notif) => {
    setSelectedNotif(notif);
    setDescription(notif.description);
    setModalType("add");
    setModalShow(true);
  };

  const handleDeleteShow = (notif) => {
    setSelectedNotif(notif);
    setModalType("delete");
    setModalShow(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "pengajuan", selectedNotif.id));
      setToastMessage(`Notification deleted successfully!`);
      setToastShow(true);
      handleClose();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setError("Description cannot contain only spaces.");
      return;
    }
    try {
      // Tambahkan fakta permasalahan baru
      await addDoc(collection(db, "fakta-permasalahan"), {
        nama_fakta: trimmedDescription,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setToastMessage(`Fact added successfully: ${trimmedDescription}`);
      setToastShow(true);

      // Perbarui status notifikasi menjadi "handled" dan isRead menjadi true
      if (selectedNotif) {
        await updateDoc(doc(db, "pengajuan", selectedNotif.id), {
          status: "handled",
          isRead: true,
        });
      }
      handleClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchNotifikasi = () => {
    const pengajuanQuery = query(
      collection(db, "pengajuan"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(pengajuanQuery, (querySnapshot) => {
      const pengajuanData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersQuerySnapshot = getDocs(collection(db, "users")).then(
        (usersQuerySnapshot) => {
          const usersData = usersQuerySnapshot.docs.reduce((acc, doc) => {
            acc[doc.data().uid] = doc.data();
            return acc;
          }, {});
          console.log(usersData);

          const notifikasiData = pengajuanData.map((pengajuan) => {
            const pengusulData = usersData[pengajuan.pengusul] || {};
            return {
              ...pengajuan,
              pengusulNama: pengusulData.nama || "Unknown",
              pengusulNpm: pengusulData.npm || "Unknown",
            };
          });

          const sortedData = notifikasiData.sort((a, b) => {
            if (a.isRead === b.isRead) {
              return b.createdAt.seconds - a.createdAt.seconds;
            }
            return a.isRead ? 1 : -1;
          });

          setNotifikasi(sortedData);
          setLoading(false);

          const unreadCount = sortedData.filter(
            (notif) => !notif.isRead
          ).length;
          updateUnreadCount(unreadCount);
        }
      );
    });

    return unsubscribe;
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "pengajuan", id), {
        isRead: true,
      });
      setToastMessage(`Notification marked as read successfully!`);
      setToastShow(true);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const options = { hour: "2-digit", minute: "2-digit" };

    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], options)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], options)}`;
    } else {
      return date.toLocaleDateString([], {
        day: "2-digit",
        month: "long",
        year: "numeric",
        ...options,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = fetchNotifikasi();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  const renderNotifikasi = () => {
    const unreadNotifikasi = notifikasi.filter((notif) => !notif.isRead);
    const readNotifikasi = notifikasi.filter((notif) => notif.isRead);

    return (
      <>
        {unreadNotifikasi.length > 0 && (
          <>
            <h3>Unread Notifications</h3>
            {unreadNotifikasi.map((notif) => (
              <div key={notif.id} className="notifikasi-card">
                <div className="notifikasi-content">
                  <div className="notifikasi-header">
                    <p className="notifikasi-description">
                      {notif.description}
                    </p>
                  </div>
                  <p className="notifikasi-meta">
                    {formatDate(notif.createdAt)} by {notif.pengusulNama} -{" "}
                    {notif.pengusulNpm}
                  </p>
                  <div className="notifikasi-actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-add`}>Add</Tooltip>}
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleAddShow(notif)}
                        className="mr-2"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top-delete`}>Delete</Tooltip>
                      }
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(notif)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="notification-icon">
                  <span className="material-symbols-outlined unread-icon">
                    notifications_unread
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark as Read
                  </Button>
                  {notif.status && <p>Status: {notif.status}</p>}
                </div>
              </div>
            ))}
            <hr className="notifikasi-divider" />
          </>
        )}

        {readNotifikasi.length > 0 && (
          <>
            <h3>Read Notifications</h3>
            {readNotifikasi.map((notif) => (
              <div key={notif.id} className="notifikasi-card">
                <div className="notifikasi-content">
                  <div className="notifikasi-header">
                    <p className="notifikasi-description">
                      {notif.description}
                    </p>
                  </div>
                  <p className="notifikasi-meta">
                    {formatDate(notif.createdAt)} by {notif.pengusulNama} -{" "}
                    {notif.pengusulNpm}
                  </p>
                  <div className="notifikasi-actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-add`}>Add</Tooltip>}
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleAddShow(notif)}
                        className="mr-2"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top-delete`}>Delete</Tooltip>
                      }
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(notif)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="notification-icon">
                  {notif.status && <p>Status: {notif.status}</p>}
                </div>
              </div>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="notifikasi-admin">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">notifications</span>
          <h1>Notifications</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : notifikasi.length === 0 ? (
          <p>No Notifications</p>
        ) : (
          <div className="notifikasi-list">{renderNotifikasi()}</div>
        )}
      </div>

      <ModalCRUD
        item="Fact"
        show={modalShow}
        handleClose={handleClose}
        handleSubmit={modalType === "delete" ? handleDelete : handleAddSubmit}
        title={
          modalType === "delete" ? "Confirm Delete Notification" : "Add as Fact"
        }
        buttonLabel={modalType === "delete" ? "Delete" : "Save"}
        nama={description}
        setNama={setDescription}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type={modalType}
      />

      <ToastHelpdesk
        show={toastShow}
        message={toastMessage}
        duration={3000}
        onClose={() => setToastShow(false)}
      />
    </div>
  );
};

export default NotifikasiAdmin;
