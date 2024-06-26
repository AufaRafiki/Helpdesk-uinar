/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebaseConfig"; // Import Firebase config
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
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
import "./styles/Content.css";

const Kesimpulan = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [namaKesimpulan, setNamaKesimpulan] = useState("");
  const [editNamaKesimpulan, setEditNamaKesimpulan] = useState("");
  const [kesimpulan, setKesimpulan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const editTooltipRef = useRef(null);
  const deleteTooltipRef = useRef(null);

  const showToast = (message, duration = 3000) => {
    setToastMessage(message);
    setToastShow(true);

    setTimeout(() => {
      setToastShow(false);
    }, duration);
  };

  const handleClose = () => {
    setShow(false);
    setNamaKesimpulan("");
    setError("");
  };
  const handleShow = () => setShow(true);

  const handleEditClose = () => {
    setEditShow(false);
    if (editTooltipRef.current) {
      editTooltipRef.current.hide();
      setEditNamaKesimpulan("");
      setError("");
    }
  };
  const handleEditShow = (id, nama) => {
    setEditId(id);
    setEditNamaKesimpulan(nama);
    setEditShow(true);
  };

  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
    if (deleteTooltipRef.current) {
      deleteTooltipRef.current.hide();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNamaKesimpulan = namaKesimpulan.trim();
    if (!trimmedNamaKesimpulan) {
      setError("Nama Kesimpulan tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = await addDoc(collection(db, "kesimpulan"), {
        nama_kesimpulan: trimmedNamaKesimpulan,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      console.log("Document written with ID: ", docRef.id);
      setKesimpulan([
        ...kesimpulan,
        { id: docRef.id, nama_kesimpulan: trimmedNamaKesimpulan },
      ]);
      setNamaKesimpulan("");
      // Refresh rules
      fetchRules();
      handleClose();
      showToast("Kesimpulan berhasil ditambahkan!", 3000); // Menampilkan toast selama 3 detik
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaFakta = editNamaKesimpulan.trim();
    if (!trimmedEditNamaFakta) {
      setError("Nama Kesimpulan tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = doc(db, "kesimpulan", editId);
      await updateDoc(docRef, {
        nama_kesimpulan: trimmedEditNamaFakta,
        updatedAt: timestamp,
      });
      setKesimpulan(
        kesimpulan.map((fakta) =>
          fakta.id === editId
            ? { ...fakta, nama_kesimpulan: trimmedEditNamaFakta }
            : fakta
        )
      );
      setEditNamaKesimpulan("");
      handleEditClose();
      showToast("Kesimpulan berhasil diedit!", 3000); // Menampilkan toast selama 3 detik
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      // Fetch all rules with the id_solusi field equal to deleteId
      const rulesQuerySnapshot = await getDocs(
        query(collection(db, "rules"), where("id_kesimpulan", "==", deleteId))
      );

      // Update each rule to remove the deleteId from id_solusi field
      const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
        updateDoc(ruleDoc.ref, {
          id_kesimpulan: "", // or "" depending on your schema
        })
      );
      await Promise.all(updatePromises);
      await deleteDoc(doc(db, "kesimpulan", deleteId));
      setKesimpulan(kesimpulan.filter((fakta) => fakta.id !== deleteId));
      handleDeleteClose();
      showToast("Kesimpulan berhasil dihapus!", 3000); // Menampilkan toast selama 3 detik
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const fetchRules = async () => {
    const querySnapshot4 = await getDocs(
      query(collection(db, "kesimpulan"), orderBy("createdAt", "asc"))
    );
    const data4 = querySnapshot4.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setKesimpulan(data4);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "kesimpulan"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKesimpulan(data);
      fetchRules();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  return (
    <div className="kesimpulan">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">assessment</span>
          <h1>Kesimpulan</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : kesimpulan.length === 0 ? (
          <p>Tidak Ada Kesimpulan</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="no">No</th>
                <th className="name">Nama Kesimpulan</th>
                <th className="aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kesimpulan.map((fakta, i) => (
                <tr key={fakta.id}>
                  <td className="no">{i + 1}</td>
                  <td className="name">{fakta.nama_kesimpulan}</td>
                  <td className="aksi">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
                      ref={editTooltipRef}
                    >
                      <Button
                        variant="warning"
                        onClick={() =>
                          handleEditShow(fakta.id, fakta.nama_kesimpulan)
                        }
                        className="me-2"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top-delete`}>Delete</Tooltip>
                      }
                      ref={deleteTooltipRef}
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteShow(fakta.id)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Button variant="primary" onClick={handleShow} className="add-button">
          Tambah Kesimpulan
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Kesimpulan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formNamaFakta">
              <Form.Label>Nama Kesimpulan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama fakta"
                value={namaKesimpulan}
                onChange={(e) => setNamaKesimpulan(e.target.value)}
                ref={inputRef} // Tambahkan ref untuk input
                required
                style={{ color: "black" }} // Buat warna teks menjadi hitam
              />
              {error && <p className="text-danger mt-2">{error}</p>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={editShow} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Kesimpulan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formEditNamaFakta">
              <Form.Label>Nama Kesimpulan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama fakta"
                value={editNamaKesimpulan}
                onChange={(e) => setEditNamaKesimpulan(e.target.value)}
                required
                style={{ color: "black" }} // Buat warna teks menjadi hitam
              />
              {error && <p className="text-danger mt-2">{error}</p>}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus kesimpulan ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
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

export default Kesimpulan;
