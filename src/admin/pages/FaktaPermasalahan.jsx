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
  arrayRemove,
} from "firebase/firestore";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import ToastHelpdesk from "../components/ToastHelpdesk";
import ModalHelpdesk from "../components/ModalHelpdesk";
import "./styles/Content.css";

const FaktaPermasalahan = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [namaFakta, setNamaFakta] = useState("");
  const [editNamaFakta, setEditNamaFakta] = useState("");
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const editTooltipRef = useRef(null);
  const deleteTooltipRef = useRef(null);
  const inputRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    setToastShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setNamaFakta("");
    setEditNamaFakta("");
    setError("");
  };

  const handleShow = () => setShow(true);

  const handleEditShow = (id, nama) => {
    setEditId(id);
    setEditNamaFakta(nama);
    setEditShow(true);
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNamaFakta = namaFakta.trim();
    if (!trimmedNamaFakta) {
      setError("Nama Fakta tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = await addDoc(collection(db, "fakta-permasalahan"), {
        nama_fakta: trimmedNamaFakta,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      setFaktaPermasalahan([
        ...faktaPermasalahan,
        { id: docRef.id, nama_fakta: trimmedNamaFakta },
      ]);
      setNamaFakta("");
      fetchRules();
      handleClose();
      showToast("Fakta berhasil ditambahkan!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaFakta = editNamaFakta.trim();
    if (!trimmedEditNamaFakta) {
      setError("Nama Fakta tidak boleh hanya berisi spasi.");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = doc(db, "fakta-permasalahan", editId);
      await updateDoc(docRef, {
        nama_fakta: trimmedEditNamaFakta,
        updatedAt: timestamp,
      });
      setFaktaPermasalahan(
        faktaPermasalahan.map((fakta) =>
          fakta.id === editId
            ? { ...fakta, nama_fakta: trimmedEditNamaFakta }
            : fakta
        )
      );
      setEditNamaFakta("");
      handleClose();
      showToast("Fakta berhasil diedit!");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      const rulesQuerySnapshot = await getDocs(
        query(
          collection(db, "rules"),
          where("id_fakta", "array-contains", deleteId)
        )
      );

      const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
        updateDoc(ruleDoc.ref, {
          id_fakta: arrayRemove(deleteId),
        })
      );
      await Promise.all(updatePromises);

      await deleteDoc(doc(db, "fakta-permasalahan", deleteId));
      setFaktaPermasalahan(
        faktaPermasalahan.filter((fakta) => fakta.id !== deleteId)
      );

      handleClose();
      showToast(`Fakta berhasil dihapus!`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const fetchRules = async () => {
    const querySnapshot4 = await getDocs(
      query(collection(db, "fakta-permasalahan"), orderBy("createdAt", "asc"))
    );
    const data4 = querySnapshot4.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFaktaPermasalahan(data4);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "fakta-permasalahan"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaktaPermasalahan(data);
      fetchRules();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (show || editShow) {
      inputRef.current.focus();
    }
  }, [show, editShow]);

  return (
    <div className="fakta-permasalahan">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">report_problem</span>
          <h1>Fakta Permasalahan</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : faktaPermasalahan.length === 0 ? (
          <p>Tidak Ada Fakta Permasalahan</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="no">No</th>
                <th className="name">Nama Fakta</th>
                <th className="aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {faktaPermasalahan.map((fakta, i) => (
                <tr key={fakta.id}>
                  <td className="no">{i + 1}</td>
                  <td className="name">{fakta.nama_fakta}</td>
                  <td className="aksi">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
                      ref={editTooltipRef}
                    >
                      <Button
                        variant="warning"
                        onClick={() =>
                          handleEditShow(fakta.id, fakta.nama_fakta)
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
          Tambah Fakta Permasalahan
        </Button>
      </div>

      <ModalHelpdesk
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Tambah Fakta Permasalahan"
        buttonLabel="Simpan"
        namaFakta={namaFakta}
        setNamaFakta={setNamaFakta}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="add"
      />

      <ModalHelpdesk
        show={editShow}
        handleClose={handleClose}
        handleSubmit={handleEditSubmit}
        title="Edit Fakta Permasalahan"
        buttonLabel="Simpan"
        namaFakta={editNamaFakta}
        setNamaFakta={setEditNamaFakta}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="edit"
      />

      <ModalHelpdesk
        show={deleteShow}
        handleClose={handleClose}
        handleSubmit={confirmDelete}
        title="Konfirmasi Hapus"
        buttonLabel="Hapus"
        type="delete"
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

export default FaktaPermasalahan;
