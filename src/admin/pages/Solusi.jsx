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
import { Modal, Button, Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import "./styles/Content.css";

const Solusi = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [namaSolusi, setNamaSolusi] = useState("");
  const [editNamaSolusi, setEditNamaSolusi] = useState("");
  const [solusi, setSolusi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const editTooltipRef = useRef(null);
  const deleteTooltipRef = useRef(null);
  const inputRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setNamaSolusi("");
    setError("");
  };
  const handleShow = () => setShow(true);

  const handleEditClose = () => {
    setEditShow(false);
    setEditNamaSolusi("");
    setError("");
  };
  const handleEditShow = (id, nama) => {
    setEditId(id);
    setEditNamaSolusi(nama);
    setEditShow(true);
  };

  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNamaSolusi = namaSolusi.trim();
    if (!trimmedNamaSolusi) {
      setError("Nama Solusi tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = await addDoc(collection(db, "solusi"), {
        nama_solusi: trimmedNamaSolusi,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      console.log("Document written with ID: ", docRef.id);
      setSolusi([
        ...solusi,
        {
          id: docRef.id,
          nama_solusi: trimmedNamaSolusi,
        },
      ]);
      setNamaSolusi("");
      // Refresh rules
      fetchRules();
      handleClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaSolusi = editNamaSolusi.trim();
    if (!trimmedEditNamaSolusi) {
      setError("Nama Solusi tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = doc(db, "solusi", editId);
      await updateDoc(docRef, {
        nama_solusi: trimmedEditNamaSolusi,
        updatedAt: timestamp,
      });
      setSolusi(
        solusi.map((solusi) =>
          solusi.id === editId
            ? { ...solusi, nama_solusi: trimmedEditNamaSolusi }
            : solusi
        )
      );
      setEditNamaSolusi("");
      handleEditClose();
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      // Fetch all rules with the id_solusi field equal to deleteId
      const rulesQuerySnapshot = await getDocs(
        query(collection(db, "rules"), where("id_solusi", "==", deleteId))
      );

      // Update each rule to remove the deleteId from id_solusi field
      const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
        updateDoc(ruleDoc.ref, {
          id_solusi: "", // or "" depending on your schema
        })
      );
      await Promise.all(updatePromises);

      // Delete the solusi document
      await deleteDoc(doc(db, "solusi", deleteId));
      setSolusi(solusi.filter((solusi) => solusi.id !== deleteId));
      handleDeleteClose();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const fetchRules = async () => {
    const querySnapshot4 = await getDocs(
      query(collection(db, "solusi"), orderBy("createdAt", "asc"))
    );
    const data4 = querySnapshot4.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSolusi(data4);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "solusi"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolusi(data);
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
    <div className="solusi">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">lightbulb</span>
          <h1>Solusi</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : solusi.length === 0 ? (
          <p>Tidak Ada Solusi</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="no">No</th>
                <th className="name">Nama Solusi</th>
                <th className="aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {solusi.map((solusi, i) => (
                <tr key={solusi.id}>
                  <td className="no">{i + 1}</td>
                  <td className="name">{solusi.nama_solusi}</td>
                  <td className="aksi">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
                      ref={editTooltipRef}
                    >
                      <Button
                        variant="warning"
                        onClick={() =>
                          handleEditShow(solusi.id, solusi.nama_solusi)
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
                        onClick={() => handleDeleteShow(solusi.id)}
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
          Tambah Solusi
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Solusi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNamaFakta">
              <Form.Label>Nama Solusi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama solusi"
                value={namaSolusi}
                onChange={(e) => setNamaSolusi(e.target.value)}
                ref={inputRef} // Tambahkan ref untuk input
                required
                style={{ color: "black" }} // Make the text color black
              />
              {error && <p className="text-danger mt-2">{error}</p>}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={editShow} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Solusi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formEditNamaFakta">
              <Form.Label>Nama Solusi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama solusi"
                value={editNamaSolusi}
                onChange={(e) => setEditNamaSolusi(e.target.value)}
                required
                style={{ color: "black" }} // Make the text color black
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
          <p>Apakah Anda yakin ingin menghapus solusi ini?</p>
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
    </div>
  );
};

export default Solusi;
