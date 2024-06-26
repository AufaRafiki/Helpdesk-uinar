/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalHelpdesk = ({
  item,
  show,
  handleClose,
  handleSubmit,
  title,
  buttonLabel,
  nama,
  setNama,
  error,
  setError,
  inputRef,
  type,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type !== "delete" ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNamaFakta">
              <Form.Label>{`Nama ${item}`}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Masukkan Nama ${item}`}
                value={nama}
                ref={inputRef}
                onChange={(e) => setNama(e.target.value)}
                required
                style={{ color: "black" }}
              />
              {error && <p className="text-danger mt-2">{error}</p>}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {buttonLabel}
            </Button>
          </Form>
        ) : (
          <p>{`Apakah Anda yakin ingin menghapus ${item} ini?`}</p>
        )}
      </Modal.Body>
      {type === "delete" && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Hapus
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ModalHelpdesk;
