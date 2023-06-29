import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { UserContext } from '../../../../context';
import { apiRoutes } from '../../../../routes';
import ioClient from '../../../../servicesSocket/socket';

const AddChannelModal = ({ show, onHide }) => {
  const { token, username } = useContext(UserContext);
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

      const { data } = await axios.get(apiRoutes.channels, { headers: { Authorization: `Bearer ${token}` } });

      if (data.channels.some((channel) => channel.name === values.channelName)) {
        setCustomError(t('errors.uniq'));
        console.log(customError);
        return;
      }

      const newChannel = { name: values.channelName, author: values.author };
      ioClient.emit('newChannel', newChannel);
      resetForm();
      onHide();
    } catch (e) {
      console.error(e, e.code, e.message);
      if (e.message === 'Network Error') {
        toast.error(t('errors.network'));
        setCustomError(false);
      }
    } finally {
      setIsLoading(false);
      console.log(inputRef);
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
