/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig"; // Import Firebase config
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
import ModalCRUD from "../components/ModalCRUD";
import TabelContentHelpdesk from "../components/TabelContentHelpdesk";
import "./styles/Content.css";

const Kesimpulan = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [nama, setNama] = useState("");
  const [editNama, setEditNama] = useState("");
  const [kesimpulan, setKesimpulan] = useState([]);
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
    const trimmedNamaKesimpulan = nama.trim();
    if (!trimmedNamaKesimpulan) {
      setError("The conclusion's name cannot consist only of spaces!");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = await addDoc(collection(db, "kesimpulan"), {
        nama_kesimpulan: trimmedNamaKesimpulan,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      setKesimpulan([
        ...kesimpulan,
        { id: docRef.id, nama_kesimpulan: trimmedNamaKesimpulan },
      ]);
      setNama("");
      fetchRules();
      handleClose();
      showToast("Conclusion successfully added!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedEditNamaKesimpulan = editNama.trim();
    if (!trimmedEditNamaKesimpulan) {
      setError("The conclusion's name cannot consist only of spaces!");
      return;
    }
    try {
      const timestamp = new Date();
      const docRef = doc(db, "kesimpulan", editId);
      await updateDoc(docRef, {
        nama_kesimpulan: trimmedEditNamaKesimpulan,
        updatedAt: timestamp,
      });
      setKesimpulan(
        kesimpulan.map((simpulan) =>
          simpulan.id === editId
            ? { ...simpulan, nama_kesimpulan: trimmedEditNamaKesimpulan }
            : simpulan
        )
      );
      setEditNama("");
      handleClose();
      showToast("Conclusion successfully edited!");
    } catch (e) {
      console.error("Error editing document: ", e);
    }
  };

  const confirmDelete = async () => {
    try {
      const rulesQuerySnapshot = await getDocs(
        query(collection(db, "rules"), where("id_kesimpulan", "==", deleteId))
      );

      const updatePromises = rulesQuerySnapshot.docs.map((ruleDoc) =>
        updateDoc(ruleDoc.ref, {
          id_kesimpulan: arrayRemove(deleteId),
        })
      );
      await Promise.all(updatePromises);

      await deleteDoc(doc(db, "kesimpulan", deleteId));
      setKesimpulan(kesimpulan.filter((simpulan) => simpulan.id !== deleteId));

      handleClose();
      showToast(`Conclusion successfully deleted!`);
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
    if (show || editShow) {
      inputRef.current.focus();
    }
  }, [show, editShow]);

  return (
    <div className="kesimpulan">
      <div className="content">
        <div className="header">
          <span className="material-symbols-outlined">report_problem</span>
          <h1>Conclusion</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : kesimpulan.length === 0 ? (
          <p>No Conclusions</p>
        ) : (
          <TabelContentHelpdesk
            item="Conclusion"
            daftarData={kesimpulan}
            handleEditShow={handleEditShow}
            handleDeleteShow={handleDeleteShow}
          />
        )}
        <Button variant="primary" onClick={handleShow} className="add-button">
          Add Conclusion
        </Button>
      </div>

      <ModalCRUD
        item="Conclusion"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add Conclusion"
        buttonLabel="Save"
        nama={nama}
        setNama={setNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="add"
      />

      <ModalCRUD
        item="Conclusion"
        show={editShow}
        handleClose={handleClose}
        handleSubmit={handleEditSubmit}
        title="Edit Conclusion"
        buttonLabel="Save"
        nama={editNama}
        setNama={setEditNama}
        error={error}
        setError={setError}
        inputRef={inputRef}
        type="edit"
      />

      <ModalCRUD
        item="Conclusion"
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

export default Kesimpulan;
