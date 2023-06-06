import React, { useContext} from "react";
import { Modal, Button, Toast } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import ioClient from "../../../../servicesSocket/socket";
import { actions as channelActions } from "../../../../slices/channelsSlice"
import { UserContext } from "../../../../context";


const AddChannelModal = ({ show, onHide, channels }) => {
  const dispatch = useDispatch();
  const context = useContext(UserContext);
  const { t } = useTranslation();

  const uniqChannelNameSchema = Yup.object().shape({
    channel: Yup.string().required(t('errors.required')).test('uniqChannel',  t('errors.uniq'),
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
          channel: "",
          author: context.username,
        }}
        validationSchema={uniqChannelNameSchema}
        onSubmit={(values, { resetForm }) => {
          try {
            const newChannel = { name: values.channel, author: values.author }
            ioClient.emit("newChannel", newChannel);
            toast.success(t('toasts.add'));
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
              <Modal.Title>{t('channels.addChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {errors.uniqChannel}
                <Field
                  name="channel"
                  aria-label="Имя канала"
                  placeholder="Имя канала"
                  className="mb-2 form-control"
                />
                <label htmlFor="channelname" className="visually-hidden">
                {t('channels.channelName')}
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

export default AddChannelModal;
