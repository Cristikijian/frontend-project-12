import React, { useContext, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { SocketsContext } from '../../../../socketsContext';

const DeleteChannelModal = ({
  show, onHide, id,
}) => {
  const { t } = useTranslation();
  const { removeChannel, onRemoveChannel } = useContext(SocketsContext);

  const handleChannelRemove = () => {
    try {
      removeChannel(id, onHide);
    } catch {
      toast.error(t('errors.network'));
    }
  };

  useEffect(() => {
    onRemoveChannel(() => {
      toast.success(t('toasts.delete'));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
