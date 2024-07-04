/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import {
  Container,
  Form,
  InputGroup,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import "./styles/StudentDashboard.css";
import StudentNavbar from "../components/StudentNavbar.jsx";
import { ambilSemuaFaktaPermasalahan } from "../database/faktaPermasalahanService.js";
import { ambilSemuaKesimpulan } from "../database/kesimpulanService.js";
import { ambilSemuaSolusi } from "../database/solusiService.js";
import { tambahNotification } from "../database/notificationService.js";
import { ambilSemuaRules } from "../database/rulesService.js";

// HelpSection Component
const HelpSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="help-section">
      <Container className="text-center">
        <h1>How Can I Help You?</h1>
        <InputGroup className="search-bar w-75 mx-auto">
          <InputGroup.Text className="search-icon-container">
            <Search className="search-icon" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search your issues here..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <Button
              variant="primary"
              className="clear-search-button button-ask"
              onClick={handleClearSearch}
            >
              X
            </Button>
          )}
        </InputGroup>
      </Container>
    </div>
  );
};

const SubmitIssueForm = ({ show, handleClose }) => {
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cookies] = useCookies(["user"]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log(cookies);
      await tambahNotification(
        issueDescription,
        cookies.user ? cookies.user.uid : null
      );

      setIssueDescription("");
      handleClose();
    } catch (error) {
      console.error("Error submitting issue: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Submit New Issue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="issueDescription">
            <Form.Label>Problem Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const IssuesSection = ({ searchTerm }) => {
  const [facts, setFacts] = useState([]);
  const [filteredFacts, setFilteredFacts] = useState([]);
  const [selectedFacts, setSelectedFacts] = useState([]);
  const [solutionData, setSolutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unmatchedFacts, setUnmatchedFacts] = useState([]);
  const [partialSolutions, setPartialSolutions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notFoundSolution, setNotFoundSolution] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Tambahkan fungsi ini dalam komponen IssuesSection
  const highlightFact = (factId) => {
    const factElement = document.getElementById(factId);
    if (factElement) {
      factElement.classList.add("highlight");
      setTimeout(() => {
        factElement.classList.remove("highlight");
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchFacts = async () => {
      const factsData = [];
      await new Promise((resolve) => {
        ambilSemuaFaktaPermasalahan((faktaData) => {
          faktaData.forEach((doc) => {
            factsData.push(doc);
          });
          resolve();
        });
      });

      setFacts(factsData);
      setFilteredFacts(factsData);
    };
    fetchFacts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = facts.filter((fact) =>
        fact.nama_fakta.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFacts(filtered);
    } else {
      setFilteredFacts(facts);
    }
  }, [searchTerm, facts]);

  const handleCheckboxChange = (id) => {
    setSelectedFacts((prev) =>
      prev.includes(id) ? prev.filter((factId) => factId !== id) : [...prev, id]
    );
  };

  const handleCardClick = (id) => {
    handleCheckboxChange(id);
  };

  const handleFindSolution = async () => {
    setIsLoading(true);
    const rulesData = [];
    await new Promise((resolve) => {
      ambilSemuaRules((rules) => {
        rules.forEach((doc) => {
          rulesData.push(doc);
        });
        resolve();
      });
    });

    const solutionsFound = [];
    const matchedFactIds = new Set();

    for (let rule of rulesData) {
      const { id_fakta, id_kesimpulan, id_solusi } = rule;

      if (id_fakta.every((fact) => selectedFacts.includes(fact))) {
        const daftarFakta = [];

        await ambilSemuaFaktaPermasalahan((faktaData) => {
          id_fakta.forEach((fakta) => {
            faktaData.forEach((doc) => {
              if (doc.id === fakta) {
                daftarFakta.push(doc.nama_fakta);
                matchedFactIds.add(fakta);
              }
            });
          });
        });

        let conclusionText = "";
        await ambilSemuaKesimpulan((kesimpulanData) => {
          console.log(kesimpulanData);
          kesimpulanData.forEach((satuKesimpulan) => {
            if (satuKesimpulan.id === id_kesimpulan) {
              conclusionText = satuKesimpulan.nama_kesimpulan;
            }
          });
        });

        let solutionText = "";
        await new Promise((resolve) => {
          ambilSemuaSolusi((solusiData) => {
            solusiData.forEach((satuSolusi) => {
              if (satuSolusi.id === id_solusi) {
                solutionText = satuSolusi.nama_solusi;
              }
            });
            resolve();
          });
        });

        solutionsFound.push({
          facts: daftarFakta,
          conclusion: conclusionText,
          solution: solutionText,
        });
      }
    }

    // Identify unmatched facts
    const unmatchedFactsList = selectedFacts.filter(
      (factId) => !matchedFactIds.has(factId)
    );

    // Finding partial solutions for unmatched facts
    const partialSolutionsFound = [];
    for (let rule of rulesData) {
      const { id_fakta, id_kesimpulan, id_solusi } = rule;
      const intersectingFacts = id_fakta.filter((fact) =>
        unmatchedFactsList.includes(fact)
      );

      if (intersectingFacts.length > 0) {
        const daftarFaktaUnmatched = [];
        const daftarFaktaMatched = [];

        ambilSemuaFaktaPermasalahan((rules) => {
          id_fakta.forEach((fakta) => {
            rules.forEach((doc) => {
              if (doc.id === fakta) {
                if (unmatchedFactsList.includes(fakta)) {
                  daftarFaktaUnmatched.push(doc.nama_fakta);
                } else {
                  daftarFaktaMatched.push({
                    nama: doc.nama_fakta,
                    id: doc.id,
                  });
                }
              }
            });
          });
        });

        let conclusionText = "";
        await ambilSemuaKesimpulan((kesimpulanData) => {
          kesimpulanData.forEach((satuKesimpulan) => {
            if (satuKesimpulan.id === id_kesimpulan) {
              conclusionText = satuKesimpulan.nama_kesimpulan;
            }
          });
        });

        let solutionText = "";
        await new Promise((resolve) => {
          ambilSemuaSolusi((solusiData) => {
            solusiData.forEach((satuSolusi) => {
              if (satuSolusi.id === id_solusi) {
                solutionText = satuSolusi.nama_solusi;
              }
            });
            resolve();
          });
        });

        partialSolutionsFound.push({
          factsMatched: daftarFaktaMatched,
          factsUnmatched: daftarFaktaUnmatched,
          conclusion: conclusionText,
          solution: solutionText,
        });
      }
    }

    setSolutionData(solutionsFound);
    setUnmatchedFacts(unmatchedFactsList);
    setPartialSolutions(partialSolutionsFound);
    setIsLoading(false);
    (solutionsFound.length == 0 && partialSolutionsFound.length == 0) ? (setNotFoundSolution(true)) : (setNotFoundSolution(false))
  };

  return (
    <div className="issues-section">
      <div className="facts-list mt-5">
        <h4>Or Select Your Issues Below</h4>
        {filteredFacts.length > 0 ? (
          filteredFacts.map((fact) => (
            <div
              key={fact.id}
              id={fact.id}
              className={`fact-item ${
                selectedFacts.includes(fact.id) ? "selected" : ""
              }`}
              onClick={() => handleCardClick(fact.id)}
            >
              <div className="fact-text">{fact.nama_fakta}</div>
              <Form.Check
                type="checkbox"
                checked={selectedFacts.includes(fact.id)}
                onChange={() => handleCheckboxChange(fact.id)}
                className="fact-checkbox"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ))
        ) : (
          <div className="no-facts-message">
            <p>No facts found matching the search criteria.</p>
          </div>
        )}
        <Button
          variant="primary"
          className={`find-solution-button ${
            selectedFacts.length < 1 ? "disabled" : ""
          }`}
          onClick={handleFindSolution}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : selectedFacts < 1 ? (
            <>
              <FontAwesomeIcon icon={faLock} /> Find the Solution
            </>
          ) : (
            "Find the Solution"
          )}
        </Button>
        {(solutionData.length > 0 || partialSolutions.length > 0) && (
          <div className="solution-section mt-5">
            {solutionData.map((solution, index) => (
              <div key={index} className="solution-item">
                <h3>Completion {index + 1}</h3>
                <hr />
                <div>
                  <h4>Facts of the Problem:</h4>
                  <ul>
                    {solution.facts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Fix Conclusion:</h4>
                  <p>{solution.conclusion}</p>
                </div>
                <div>
                  <h4>Fix Solution:</h4>
                  <p>{solution.solution}</p>
                </div>
              </div>
            ))}

            {partialSolutions.map((solution, index) => (
              <div key={index} className="solution-item">
                <h3>Completion {index + solutionData.length + 1}</h3>
                <hr />
                <div>
                  <h4>Facts of the Problem:</h4>
                  <ul>
                    {solution.factsUnmatched.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Possible Conclusions:</h4>
                  <p>{solution.conclusion}</p>
                </div>
                <div>
                  <h4>Possible Solutions:</h4>
                  <p>{solution.solution}</p>
                </div>
                <div>
                  <h4>
                    Check the following problem facts in order to make the
                    conclusions and solutions fixed:
                  </h4>
                  <ul>
                    {solution.factsMatched.map((fact, idx) => (
                      <li key={idx}>
                        <a
                          href={`#${fact.id}`}
                          onClick={() => highlightFact(fact.id)}
                        >
                          {fact.nama}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {}
          </div>
        )}
        {(notFoundSolution == true) && (
          <div className="no-facts-message">
          <p>No solution found matching the facts criteria.</p>
        </div>
        )}
        <Button
          variant="link"
          className="new-problem-button"
          onClick={handleShowModal}
        >
          Can't find your issue? Submit a new problem.
        </Button>
        <SubmitIssueForm show={showModal} handleClose={handleCloseModal} />
      </div>
    </div>
  );
};

// StudentDashboard Component
const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="main">
      <StudentNavbar activeLink="Dashboard" />
      <HelpSection onSearch={handleSearch} />
      <IssuesSection searchTerm={searchTerm} />
    </div>
  );
};

export default StudentDashboard;
