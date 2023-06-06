import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ioClient from "../../../../servicesSocket/socket";

const DeleteChannelModal = ({ show, onHide, id}) => {
  const { t } = useTranslation();

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
              <Modal.Title>{t('channels.delete')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p className="lead">{t('questions.areYouSure')}</p>
                <div className="invalid-feedback"></div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
              {t('buttons.cancel')}
              </Button>
              <Button variant="primary" type="button" className="btn btn-danger" onClick={handleChannelRemove}>
              {t('buttons.delete')}
              </Button>
            </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;