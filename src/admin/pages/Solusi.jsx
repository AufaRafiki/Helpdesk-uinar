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
import { Button } from "react-bootstrap";
import ToastHelpdesk from "../components/ToastHelpdesk";
import ModalHelpdesk from "../components/ModalHelpdesk";
import TabelContentHelpdesk from "../components/TabelContentHelpdesk";
import "./styles/Content.css";

const Solusi = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [nama, setNama] = useState("");
  const [editNama, setEditNama] = useState("");
  const [solusi, setSolusi] = useState([]);
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
    setNama("");
    setEditNama("");
    setError("");
  };

  const handleShow = () => setShow(true);

  const handleEditShow = (id, nama) => {
    setEditId(id);
    setEditNama(nama);
    setEditShow(true);
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedNamaSolusi = nama.trim();
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
      setSolusi([
        ...solusi,
        { id: docRef.id, nama_solusi: trimmedNamaSolusi },
      ]);
      setNama("");
      fetchRules();
      handleClose();
      showToast("Solusi berhasil ditambahkan!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaSolusi = editNama.trim();
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
        solusi.map((solusiSatu) =>
          solusiSatu.id === editId
            ? { ...solusiSatu, nama_solusi: trimmedEditNamaSolusi }
            : solusiSatu
        )
      );
      setEditNama("");
      handleClose();
      showToast("Solusi berhasil diedit!");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      const rulesQuerySnapshot = await getDocs(
        query(collection(db, "rules"), where("id_solusi", "==", deleteId))
      );

      const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
        updateDoc(ruleDoc.ref, {
          id_solusi: arrayRemove(deleteId),
        })
      );
      await Promise.all(updatePromises);

      await deleteDoc(doc(db, "solusi", deleteId));
      setSolusi(solusi.filter((solusiSatu) => solusiSatu.id !== deleteId));

      handleClose();
      showToast(`Solusi berhasil dihapus!`);
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
    if (show || editShow) {
      inputRef.current.focus();
    }
  }, [show, editShow]);

  return (
    <div className="solusi">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">report_problem</span>
          <h1>Solusi</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : solusi.length === 0 ? (
          <p>Tidak Ada Solusi</p>
        ) : (
          <TabelContentHelpdesk
            item="Solusi"
            daftarData={solusi}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
          />
        )}
        <Button variant="primary" onClick={handleShow} className="add-button">
          Tambah Solusi
        </Button>
      </div>

      <ModalHelpdesk
        item="Solusi"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Tambah Solusi"
        buttonLabel="Simpan"
        nama={nama}
        setNama={setNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="add"
      />

      <ModalHelpdesk
        item="Solusi"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={handleEditSubmit}
        title="Edit Solusi"
        buttonLabel="Simpan"
        nama={editNama}
        setNama={setEditNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="edit"
      />

      <ModalHelpdesk
        item="Solusi"
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

export default Solusi;
