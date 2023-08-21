import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { AuthContext } from '../../../../authContext';
import { selectors as channelSelectors } from '../../../../slices/channelsSlice';
import { SocketsContext } from '../../../../socketsContext';

const AddChannelModal = ({ show, onHide }) => {
  const { username } = useContext(AuthContext);
  const channels = useSelector(channelSelectors.selectAll);
  const { addChannel } = useContext(SocketsContext);
  const [inputRef, setInputRef] = useState();
  const [customError, setCustomError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
    }
  }, [inputRef]);

  const { t } = useTranslation();

  const uniqChannelNameSchema = Yup.object().shape({
    channelName: Yup.string().required(t('errors.required')),

  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      setCustomError(false);

      if (channels.some((channel) => channel.name === values.channelName)) {
        setCustomError(t('errors.uniq'));
        return;
      }

      const newChannel = { name: values.channelName, author: values.author };
      addChannel(('newChannel', newChannel), () => {
        if (newChannel.author === username) {
          toast.success(t('toasts.add'));
        }
        resetForm();
        onHide();
      });
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
          author: username,
        }}
        validationSchema={uniqChannelNameSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, handleChange }) => (
          <Form>
            <Modal.Header closeButton onHide={onHide}>
              <Modal.Title>{t('channels.addChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Field
                  name="channelName"
                  aria-label={t('channels.channelName')}
                  placeholder={t('channels.channelName')}
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
              <Button variant="secondary" onClick={onHide}>
                {t('buttons.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {t('buttons.send')}
              </Button>

            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
