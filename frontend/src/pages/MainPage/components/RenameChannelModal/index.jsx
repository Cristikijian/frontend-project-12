import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { selectors as channelSelectors } from '../../../../slices/channelsSlice';
import { SocketsContext } from '../../../../socketsContext';

const RenameChannelModal = ({ show, onHide, channel }) => {
  const channels = useSelector(channelSelectors.selectAll);
  const { renameChannel } = useContext(SocketsContext);
  const [inputRef, setInputRef] = useState();
  const [customError, setCustomError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  const { t } = useTranslation();

  if (!channel) {
    return null;
  }

  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string().required(t('errors.required')).notOneOf(channels.map((currentChannel) => currentChannel.name), t('errors.uniq')),
  });

  const handleSubmit = async (values) => {
    if (channel.name === values.channelName) {
      onHide();
      return;
    }

    setIsLoading(true);

    renameChannel({ id: channel.id, name: values.channelName }, () => {
      toast.success(t('toasts.rename'));
      setIsLoading(false);
      onHide();
    });
  };

  return (
    <Modal show={show}>
      <Formik
        initialValues={{
          channelName: channel.name,
        }}
        validationSchema={channelNameSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, handleChange }) => (
          <Form>
            <Modal.Header
              closeButton
              onHide={() => {
                setCustomError(false);
                onHide();
              }}
            >
              <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Field
                  name="channelName"
                  // placeholder={t('channels.channelName')}
                  id="channelName"
                  className={cn('form-control', 'mb-2', { 'is-invalid': Boolean(errors.channelName) || customError })}
                  onChange={(e) => {
                    setCustomError(false);
                    handleChange(e);
                  }}
                  innerRef={(el) => {
                    if (!el) {
                      return;
                    }
                    setInputRef(el);
                  }}
                />
                <label className="visually-hidden" htmlFor="channelName">{t('channels.channelName')}</label>
                <div className="invalid-feedback">
                  { errors.channelName }
                  { customError }
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  onHide();
                  setCustomError(false);
                }}
              >
                {t('buttons.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {t('buttons.rename')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
