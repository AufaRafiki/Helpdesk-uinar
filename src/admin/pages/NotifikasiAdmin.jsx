/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  Modal,
  Button,
  Form,
  Tooltip,
  OverlayTrigger,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./styles/NotifikasiAdmin.css";

const NotifikasiAdmin = () => {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState("");
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addShow, setAddShow] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [error, setError] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setDescription("");
    setError("");
  };

  const handleAddClose = () => setAddShow(false);
  const handleAddShow = (notif) => {
    setSelectedNotif(notif);
    setDescription(notif.description);
    setAddShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pengajuan", id));
      setNotifikasi(notifikasi.filter((notif) => notif.id !== id));
      setToastMessage(`Berhasil menghapus notifikasi dengan id: ${id}`);
      setToastShow(true);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setError("Description tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      // Tambahkan fakta permasalahan baru
      await addDoc(collection(db, "fakta-permasalahan"), {
        nama_fakta: trimmedDescription,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setToastMessage(`Berhasil menambahkan fakta: ${trimmedDescription}`);
      setToastShow(true);

      // Perbarui status notifikasi menjadi "handled" dan isRead menjadi true
      if (selectedNotif) {
        await updateDoc(doc(db, "pengajuan", selectedNotif.id), {
          status: "handled",
          isRead: true,
        });
        // Perbarui state notifikasi lokal
        setNotifikasi((prevNotifikasi) =>
          prevNotifikasi.map((notif) =>
            notif.id === selectedNotif.id
              ? { ...notif, status: "handled", isRead: true }
              : notif
          )
        );
      }

      handleAddClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchNotifikasi = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "pengajuan"), orderBy("createdAt", "desc"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Urutkan notifikasi berdasarkan isRead dan waktu
    const sortedData = data.sort((a, b) => {
      if (a.isRead === b.isRead) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return a.isRead ? 1 : -1;
    });
    setNotifikasi(sortedData);
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "pengajuan", id), {
        isRead: true,
      });
      setNotifikasi(
        notifikasi.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
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
    fetchNotifikasi();
  }, []);

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <div className="notifikasi-admin">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">notifications</span>
          <h1>Notifikasi</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : notifikasi.length === 0 ? (
          <p>Tidak Ada Notifikasi</p>
        ) : (
          <div className="notifikasi-list">
            {notifikasi.map((notif, i) => (
              <div key={notif.id} className={`notifikasi-card`}>
                <div className="notifikasi-content">
                  <div className="notifikasi-header">
                    <p className="notifikasi-description">
                      {notif.description}
                    </p>
                  </div>
                  <p className="notifikasi-meta">
                    {formatDate(notif.createdAt)} oleh {notif.pengusul}
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
                        onClick={() => handleDelete(notif.id)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="notification-icon">
                  {!notif.isRead && (
                    <>
                      <span className="material-symbols-outlined unread-icon">
                        notifications_unread
                      </span>
                      <Button
                        variant="primary"
                        onClick={() => markAsRead(notif.id)}
                      >
                        Mark as Read
                      </Button>
                    </>
                  )}
                  {notif.status && <p>Status: {notif.status}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal show={addShow} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Tambah Fakta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <Form.Group controlId="formEditDescription">
              <Form.Label>Edit Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                placeholder="Edit deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ color: "black" }}
              />
              {error && <p className="text-danger mt-2">{error}</p>}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setToastShow(false)} show={toastShow}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body style={{ color: "black" }}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default NotifikasiAdmin;
