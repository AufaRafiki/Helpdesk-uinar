/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalWarning = ({ show, handleClose, title, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWarning;
