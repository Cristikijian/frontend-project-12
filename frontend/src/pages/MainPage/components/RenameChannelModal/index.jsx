import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import { UserContext } from "../../../../context";
import ioClient from "../../../../servicesSocket/socket";


const RenameChannelModal = ({ show, onHide, channel }) => {
  const context = useContext(UserContext);
  const [ inputRef, setInputRef ] = useState();
  useEffect(() => {
    if(inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);
  const { t } = useTranslation();
  if(!channel) {
    return null;
  }
  
  const uniqChannelNameSchema = Yup.object().shape({
    channelName: Yup.string().required().test('uniqChannel', t('errors.uniq'),
      () => t('errors.uniq'),
      async (value) => {
        const {data} = await axios.get('/api/v1/data', { headers: {'Authorization': `Bearer ${context.token}`}});
        return !data.channels.some((channel) => channel.name === value);
      }
    )
  });

  return (
    <Modal show={show}>
      <Formik
        initialValues={{
          channelName: channel.name,
        }}
        validationSchema={uniqChannelNameSchema}
        onSubmit={(values, { resetForm }) => {
          try {
            ioClient.emit('renameChannel', { id: channel.id, name: values.channelName });
            resetForm();
            onHide();
          } catch (e) {
            console.error(e);
          }
        }}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Modal.Header closeButton onHide={onHide}>
              <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {errors.uniqChannel}
                <Field
                  name="channelName"
                  aria-label="Имя канала"
                  placeholder="Имя канала"
                  className="mb-2 form-control"
                  innerRef={(el) => {
                    if(!el) {
                      return;
                    }
                    if(!inputRef) {
                      setInputRef(el);
                    }          
                  }}
                />
                <label htmlFor="channelName" className="visually-hidden">
                  {channel.name}
                </label>
                <div className="invalid-feedback"></div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('buttons.cancel')}
              </Button>
              <Button variant="primary" type="submit">
                {t('buttons.send')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
