/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Collapse,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { ambilSemuaFaktaPermasalahan } from "../database/faktaPermasalahanService";
import { ambilSemuaSolusi } from "../database/solusiService";
import { ambilSemuaKesimpulan } from "../database/kesimpulanService";
import {
  tambahRule,
  editRule,
  hapusRule,
  ambilSemuaRules,
} from "../database/rulesService";
import ToastHelpdesk from "../components/ToastHelpdesk";
import "./styles/Content.css"; // Add any additional styles you need for the dashboard

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [faktaPermasalahan, setFaktaPermasalahan] = useState([]);
  const [kesimpulan, setKesimpulan] = useState([]);
  const [solusi, setSolusi] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFakta, setOpenFakta] = useState(false);
  const [openKesimpulan, setOpenKesimpulan] = useState(false);
  const [openSolusi, setOpenSolusi] = useState(false);
  const [selectedFaktaIds, setSelectedFaktaIds] = useState([]);
  const [selectedKesimpulanId, setSelectedKesimpulanId] = useState("");
  const [selectedSolusiId, setSelectedSolusiId] = useState("");
  const [currentRuleId, setCurrentRuleId] = useState(null);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const editTooltipRef = useRef(null);
  const deleteTooltipRef = useRef(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditShow(false);
    resetSelections();
  };

  const handleDeleteClose = () => setDeleteShow(false);

  const handleShow = () => {
    setShow(true);
    setCurrentRuleId(null); // Reset currentRuleId for adding new rule
  };

  const handleDeleteShow = (id) => {
    setDeleteId(id);
    setDeleteShow(true);
  };

  const handleEditShow = (rule) => {
    setSelectedFaktaIds(rule.id_fakta);
    setSelectedKesimpulanId(rule.id_kesimpulan);
    setSelectedSolusiId(rule.id_solusi);
    setCurrentRuleId(rule.id);
    setEditShow(true);
  };

  const resetSelections = () => {
    setSelectedFaktaIds([]);
    setSelectedKesimpulanId("");
    setSelectedSolusiId("");
    setError("");
    setOpenFakta(false);
    setOpenKesimpulan(false);
    setOpenSolusi(false);
  };

  const fetchRules = async () => {
    ambilSemuaRules((data) => {
      setRules(data);
    });
  };

  const fetchFakta = async () => {
    ambilSemuaFaktaPermasalahan((data) => {
      setFaktaPermasalahan(data);
    });
  };

  const fetchKesimpulan = async () => {
    ambilSemuaKesimpulan((data) => {
      setKesimpulan(data);
    });
  };

  const fetchSolusi = async () => {
    ambilSemuaSolusi((data) => {
      setSolusi(data);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchFakta();
      fetchKesimpulan();
      fetchSolusi();

      fetchRules();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async (jenis) => {
    if (
      selectedFaktaIds.length === 0 ||
      !selectedKesimpulanId ||
      !selectedSolusiId
    ) {
      setError("All fields must be filled in.");
      return;
    }

    try {
      const rule = {
        id_fakta: selectedFaktaIds,
        id_kesimpulan: selectedKesimpulanId,
        id_solusi: selectedSolusiId,
      };

      if (currentRuleId) {
        await editRule(currentRuleId, rule);
      } else {
        await tambahRule(rule);
      }

      // Refresh rules
      fetchRules();
      handleClose();
      console.log(jenis);
      jenis === 2
        ? showToast("Rule successfully edited!")
        : showToast("Rule successfully added!");
    } catch (e) {
      console.error("Error adding/updating document: ", e);
      setError("Error occurred while saving data!");
    }
  };

  const handleFaktaChange = (id) => {
    setSelectedFaktaIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleKesimpulanChange = (id) => {
    setSelectedKesimpulanId(id);
  };

  const handleSolusiChange = (id) => {
    setSelectedSolusiId(id);
  };

  const confirmDelete = async () => {
    try {
      await hapusRule(deleteId);
      const updatedRules = rules.filter((rule) => rule.id !== deleteId);
      setRules(updatedRules);
      handleDeleteClose();
      showToast("Rule successfully deleted!");
    } catch (e) {
      console.error("Error deleting document: ", e);
      setError("Error occurred while deleting data!");
    }
  };

  return (
    <div className="content">
      <div className="header">
        <span className="material-symbols-outlined">dashboard</span>
        <h1>Dashboard</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : rules.length === 0 ? (
        <p>No Rule</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="col-rule">No Rule</th>
              <th className="col-fakta">Fact of the Problem</th>
              <th className="col-kesimpulan">Conclusion</th>
              <th className="col-solusi">Solution</th>
              <th className="aksi">Action</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, i) => (
              <tr key={rule.id}>
                <td className="col-rule">Rule {i + 1}</td>
                <td className="col-fakta">
                  {rule.id_fakta.length > 0 ? (
                    <ul>
                      {rule.id_fakta.map((faktaId) => (
                        <li key={faktaId}>
                          {
                            faktaPermasalahan.find(
                              (fakta) => fakta.id === faktaId
                            )?.nama_fakta
                          }
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "red" }}
                    >
                      warning
                    </span>
                  )}
                </td>
                <td className="col-kesimpulan">
                  {kesimpulan.find(
                    (kesimpulan) => kesimpulan.id === rule.id_kesimpulan
                  )?.nama_kesimpulan ?? (
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "red" }}
                    >
                      warning
                    </span>
                  )}
                </td>
                <td className="col-solusi">
                  {solusi.find((solusi) => solusi.id === rule.id_solusi)
                    ?.nama_solusi ?? (
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "red" }}
                    >
                      warning
                    </span>
                  )}
                </td>
                <td className="aksi">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-top-edit`}>Edit</Tooltip>}
                    ref={editTooltipRef}
                  >
                    <Button
                      variant="warning"
                      onClick={() => handleEditShow(rule)}
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
                      onClick={() => handleDeleteShow(rule.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Button variant="primary" onClick={handleShow} className="add-button">
        Add Rule
      </Button>

      {/* Add Rule Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RuleForm
            openFakta={openFakta}
            setOpenFakta={setOpenFakta}
            faktaPermasalahan={faktaPermasalahan}
            selectedFaktaIds={selectedFaktaIds}
            handleFaktaChange={handleFaktaChange}
            openKesimpulan={openKesimpulan}
            setOpenKesimpulan={setOpenKesimpulan}
            kesimpulan={kesimpulan}
            selectedKesimpulanId={selectedKesimpulanId}
            handleKesimpulanChange={handleKesimpulanChange}
            openSolusi={openSolusi}
            setOpenSolusi={setOpenSolusi}
            solusi={solusi}
            selectedSolusiId={selectedSolusiId}
            handleSolusiChange={handleSolusiChange}
            error={error}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleSave(1)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Rule Modal */}
      <Modal show={editShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RuleForm
            openFakta={openFakta}
            setOpenFakta={setOpenFakta}
            faktaPermasalahan={faktaPermasalahan}
            selectedFaktaIds={selectedFaktaIds}
            handleFaktaChange={handleFaktaChange}
            openKesimpulan={openKesimpulan}
            setOpenKesimpulan={setOpenKesimpulan}
            kesimpulan={kesimpulan}
            selectedKesimpulanId={selectedKesimpulanId}
            handleKesimpulanChange={handleKesimpulanChange}
            openSolusi={openSolusi}
            setOpenSolusi={setOpenSolusi}
            solusi={solusi}
            selectedSolusiId={selectedSolusiId}
            handleSolusiChange={handleSolusiChange}
            error={error}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleSave(2)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this rule?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastHelpdesk
        show={toastShow}
        message={toastMessage}
        duration={3000}
        onClose={() => setToastShow(false)}
      />
    </div>
  );
};

// Extracted RuleForm component
const RuleForm = ({
  openFakta,
  setOpenFakta,
  faktaPermasalahan,
  selectedFaktaIds,
  handleFaktaChange,
  openKesimpulan,
  setOpenKesimpulan,
  kesimpulan,
  selectedKesimpulanId,
  handleKesimpulanChange,
  openSolusi,
  setOpenSolusi,
  solusi,
  selectedSolusiId,
  handleSolusiChange,
  error,
}) => {
  return (
    <>
      <div className="button-check">
        <Button
          variant="dark"
          onClick={() => {
            setOpenFakta(!openFakta);
          }}
          aria-controls="collapseFakta"
          aria-expanded={openFakta}
          className="mb-3 mt-3"
        >
          Select Facta of the Problem
          <span className="material-symbols-outlined">
            {openFakta ? "arrow_drop_down" : "arrow_right"}
          </span>
        </Button>
        <input
          type="checkbox"
          checked={selectedFaktaIds.length > 0}
          disabled
          className="ml-2"
        />
      </div>
      <Collapse in={openFakta}>
        <div id="collapseFakta">
          <Form>
            <div className="card card-body">
              {faktaPermasalahan.map((fakta, i) => (
                <div className="form-check" key={fakta.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={fakta.id}
                    id={i}
                    onChange={() => handleFaktaChange(fakta.id)}
                    checked={selectedFaktaIds.includes(fakta.id)}
                  />
                  <label className="form-check-label" htmlFor={i}>
                    {fakta.nama_fakta}
                  </label>
                </div>
              ))}
            </div>
          </Form>
        </div>
      </Collapse>
      <div className="button-check">
        <Button
          variant="dark"
          onClick={() => {
            setOpenKesimpulan(!openKesimpulan);
          }}
          aria-controls="collapseKesimpulan"
          aria-expanded={openKesimpulan}
          className="mb-3 mt-3"
        >
          Select Conclusion
          <span className="material-symbols-outlined">
            {openKesimpulan ? "arrow_drop_down" : "arrow_right"}
          </span>
        </Button>
        <input
          type="checkbox"
          checked={selectedKesimpulanId !== ""}
          disabled
          className="ml-2"
        />
      </div>
      <Collapse in={openKesimpulan}>
        <div id="collapseKesimpulan">
          <Form>
            <div className="card card-body">
              {kesimpulan.map((simpulan, i) => (
                <div className="form-check" key={simpulan.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="kesimpulan"
                    id={1000 + i}
                    value={simpulan.id}
                    onChange={() => handleKesimpulanChange(simpulan.id)}
                    checked={selectedKesimpulanId === simpulan.id}
                  />
                  <label className="form-check-label" htmlFor={1000 + i}>
                    {simpulan.nama_kesimpulan}
                  </label>
                </div>
              ))}
            </div>
          </Form>
        </div>
      </Collapse>
      <div className="button-check">
        <Button
          variant="dark"
          onClick={() => {
            setOpenSolusi(!openSolusi);
          }}
          aria-controls="collapseSolusi"
          aria-expanded={openSolusi}
          className="mb-3 mt-3"
        >
          Select Solution
          <span className="material-symbols-outlined">
            {openSolusi ? "arrow_drop_down" : "arrow_right"}
          </span>
        </Button>
        <input
          type="checkbox"
          checked={selectedSolusiId !== ""}
          disabled
          className="ml-2"
        />
      </div>
      <Collapse in={openSolusi}>
        <div id="collapseSolusi">
          <Form>
            <div className="card card-body">
              {solusi.map((sol, i) => (
                <div className="form-check" key={sol.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="solusi"
                    id={10000 + i}
                    value={sol.id}
                    onChange={() => handleSolusiChange(sol.id)}
                    checked={selectedSolusiId === sol.id}
                  />
                  <label className="form-check-label" htmlFor={10000 + i}>
                    {sol.nama_solusi}
                  </label>
                </div>
              ))}
            </div>
          </Form>
        </div>
      </Collapse>
      {error && <p className="text-danger mt-2">{error}</p>}
    </>
  );
};

export default Dashboard;
