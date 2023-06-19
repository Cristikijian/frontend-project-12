import axios from "axios";
import cn from "classnames";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { UserContext } from "../../../../context";
import ioClient from "../../../../servicesSocket/socket";

const RenameChannelModal = ({ show, onHide, channel }) => {
  const context = useContext(UserContext);
  const [ inputRef, setInputRef ] = useState();
  const [ customError, setCustomError ] = useState();
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    if(inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);
  
  const { t } = useTranslation();

  if (!channel) {
    return null;
  }

  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string().required(t('errors.required'))
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      setCustomError(false);

      const {data} = await axios.get('/api/v1/data', { headers: {'Authorization': `Bearer ${context.token}`}});

      if(channel.name === values.channelName) {
        onHide();
        return;
      } else {
        if (data.channels.some((channel) => channel.name === values.channelName)) {
          setCustomError(t('errors.uniq'));
          return;
        }
      }

      ioClient.emit('renameChannel', { id: channel.id, name: values.channelName });
      
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
      inputRef.reset();
    }
  }


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
            <Modal.Header closeButton onHide={() => {
              setCustomError(false);
              onHide();
            }
              }>
              <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Field
                  name="channelName"
                  placeholder={t('channels.channelName')}
                  className={cn('form-control', 'mb-2', {'is-invalid': Boolean(errors.channelName) || customError})}
                  onChange={(e) => {
                    setCustomError(false)
                    handleChange(e);
                  }}
                  innerRef={(el) => {
                    if(!el) {
                      return;
                    }
                    setInputRef(el);       
                  }}
                />
                {/* <label className="visually-hidden" htmlFor="channelName">{t('channels.channelName')}</label> */}
                <div className="invalid-feedback">
                  { errors.channelName }
                  { customError }
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={(e)=> {
                onHide();
                setCustomError(false);
              }}>
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
