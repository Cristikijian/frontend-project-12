import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SocketsContext } from '../../../../socketsContext';

const DeleteChannelModal = ({
  show, onHide, id,
}) => {
  const { t } = useTranslation();
  const { removeChannel } = useContext(SocketsContext);

  const handleChannelRemove = () => {
    removeChannel(id, () => {
      toast.success(t('toasts.delete'));
      onHide();
    });
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channels.delete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p className="lead">{t('questions.areYouSure')}</p>
          <div className="invalid-feedback" />
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
