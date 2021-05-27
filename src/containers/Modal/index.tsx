import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ModalContainerProps {
  show: boolean;
  handleClose: () => void;
  costs?: number[][];
}
export const ModalContainer = (props: ModalContainerProps) => {
  const { show, handleClose, costs } = props;
  const allCosts = costs || [];
  return (
    <Modal size="lg" centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          Chi phí Lý thuyết hàng tháng:{" "}
          {allCosts[0] ? allCosts[0].map((cost) => <span>{cost} | </span>) : ""}
        </div>
        <div>
          Chi phí Lý thuyết cộng dồn:{" "}
          {allCosts[1] ? allCosts[1].map((cost) => <span>{cost} | </span>) : ""}
        </div>
        <div>
          Chi phí Thực tế hàng tháng:{" "}
          {allCosts[2] ? allCosts[2].map((cost) => <span>{cost} | </span>) : ""}
        </div>
        <div>
          Chi phí Thực tế cộng dồn:{" "}
          {allCosts[3] ? allCosts[3].map((cost) => <span>{cost} | </span>) : ""}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
