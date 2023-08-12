import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../authContext';
import { SocketsContext } from '../../../../socketsContext';

const DeleteChannelModal = ({
  show, onHide, id,
}) => {
  const { t } = useTranslation();
  const { username } = useContext(AuthContext);
  const { removeChannel } = useContext(SocketsContext);
  const channel = useSelector((state) => state.modalWindow.channel);

  const handleChannelRemove = () => {
    try {
      removeChannel(id, onHide);
      if (channel.author === username) {
        toast.success(t('toasts.delete'));
      }
    } catch {
      toast.error(t('errors.network'));
    }
  };

  return (
    <Modal show={show}>
      <Modal.Header closeButton>
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
