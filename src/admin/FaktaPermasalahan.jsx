import React, { useState, useEffect, useRef } from "react";
import {
  tambahFaktaPermasalahan,
  editFaktaPermasalahan,
  hapusFaktaPermasalahan,
  ambilSemuaFaktaPermasalahan,
} from "../database/faktaPermasalahanService";
import { Button } from "react-bootstrap";
import ToastHelpdesk from "../components/ToastHelpdesk";
import TabelContentHelpdesk from "../components/TabelContentHelpdesk";
import "./styles/Content.css";
import ModalCRUD from "../components/ModalCRUD";

const FaktaPermasalahan = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [nama, setNama] = useState("");
  const [editNama, setEditNama] = useState("");
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
    const trimmedNamaFakta = nama.trim();
    if (!trimmedNamaFakta) {
      setError("The facta's name cannot consist only of spaces!");
      return;
    }
    try {
      await tambahFaktaPermasalahan(trimmedNamaFakta);
      setNama("");
      handleClose();
      showToast("Fact added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaFakta = editNama.trim();
    if (!trimmedEditNamaFakta) {
      setError("The facta's name cannot consist only of spaces!");
      return;
    }
    try {
      await editFaktaPermasalahan(editId, trimmedEditNamaFakta);
      handleClose();
      showToast("Fact successfully edited!");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      await hapusFaktaPermasalahan(deleteId);
      handleClose();
      showToast(`Fact successfully deleted!`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = ambilSemuaFaktaPermasalahan((data) => {
      setFaktaPermasalahan(data);
      setLoading(false);
    });
    return () => unsubscribe();
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
          <h1>Fact of the Problem</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : faktaPermasalahan.length === 0 ? (
          <p>No Facts of the Problem</p>
        ) : (
          <TabelContentHelpdesk
            item="Facta"
            daftarData={faktaPermasalahan}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
          />
        )}
        <Button variant="primary" onClick={handleShow} className="add-button">
          Add Fact of the Problem
        </Button>
      </div>

      <ModalCRUD
        item="Facta"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add Facts of the Problem"
        buttonLabel="Save"
        nama={nama}
        setNama={setNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="add"
      />

      <ModalCRUD
        item="Facta"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={handleEditSubmit}
        title="Edit Facts of the Problem"
        buttonLabel="Save"
        nama={editNama}
        setNama={setEditNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="edit"
      />

      <ModalCRUD
        item="Facta"
        show={deleteShow}
        handleClose={handleClose}
        handleSubmit={confirmDelete}
        title="Delete Confirmation"
        buttonLabel="Delete"
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
