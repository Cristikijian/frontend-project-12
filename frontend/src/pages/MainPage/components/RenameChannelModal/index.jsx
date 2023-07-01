import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { UserContext } from '../../../../context';
import { apiRoutes } from '../../../../routes';
import ioClient from '../../../../servicesSocket/socket';
import { selectors as channelSelectors } from '../../../../slices/channelsSlice';

const RenameChannelModal = ({ show, onHide }) => {
  const [inputRef, setInputRef] = useState();
  const [customError, setCustomError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { actionType, channel } = useSelector((state) => state.modalWindow);
  const { token } = useContext(UserContext);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  const channels = useSelector(channelSelectors.selectAll);

  const { t } = useTranslation();

  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string().required(t('errors.required')),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      setCustomError(false);

      switch (actionType) {
        case 'add': {
          const { data } = await axios.get(apiRoutes.channels, { headers: { Authorization: `Bearer ${token}` } });

          if (data.channels.some((c) => c.name === values.channelName)) {
            setCustomError(t('errors.uniq'));
            return;
          }

          const newChannel = { name: values.channelName, author: values.author };
          ioClient.emit('newChannel', newChannel);
          resetForm();
          onHide();
          break;
        }

        case 'rename':
          if (channel.name === values.channelName) {
            onHide();
            return;
          }
          if (channels.some((ch) => ch.name === values.channelName)) {
            setCustomError(t('errors.uniq'));
            return;
          }

          ioClient.emit('renameChannel', { id: channel.id, name: values.channelName }, () => {
            resetForm();
            onHide();
          });
          break;
        case 'remove':
          ioClient.emit('removeChannel', channel.id);
          onHide();
          break;
        default: return;
      }
    } catch (e) {
      console.error(e, e.code, e.message);
      if (e.message === 'Network Error') {
        toast.error(t('errors.network'));
        setCustomError(false);
      }
    } finally {
      setIsLoading(false);
      inputRef.reset();
    }
  };

  return (
    <Modal show={show}>
      <Formik
        initialValues={{
          channelName: '',
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
              <Modal.Title>{t(`channelModal.title.${actionType}`)}</Modal.Title>
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
                {t(`channelModal.buttons.${actionType}`)}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
