import React from "react";
import { Modal, Button } from "react-bootstrap";
import ioClient from "../../../../servicesSocket/socket";
import * as Yup from 'yup';

const DeleteChannelModal = ({ show, onHide, id}) => {

  const handleChannelRemove = () => {
    try {
      ioClient.emit('removeChannel', { id });
      onHide();
    }
    catch {
      console.log('Error')
    }
  }

  return (
    <Modal show={show}>
            <Modal.Header closeButton>
              <Modal.Title>Удалить канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p className="lead">Уверены?</p>
                <div className="invalid-feedback"></div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Отменить
              </Button>
              <Button variant="primary" type="button" className="btn btn-danger" onClick={handleChannelRemove}>
                Удалить
              </Button>
            </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;