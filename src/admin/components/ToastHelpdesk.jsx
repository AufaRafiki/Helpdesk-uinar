/* eslint-disable react/prop-types */
import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastHelpdesk = ({ show, message, duration, onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast onClose={onClose} show={show}>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body style={{ color: "black" }}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastHelpdesk;
