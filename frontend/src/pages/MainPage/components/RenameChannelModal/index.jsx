import React, { useContext} from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import ioClient from "../../../../servicesSocket/socket";
import { useTranslation } from "react-i18next";
import { actions as channelActions } from "../../../../slices/channelsSlice"
import { UserContext } from "../../../../context";


const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const context = useContext(UserContext);
  const { t } = useTranslation();
  if(!channel) {
    return null;
  }

  console.log(channel);
  const uniqChannelNameSchema = Yup.object().shape({
    channel: Yup.string().required().test('uniqChannel', t('errors.uniq'),
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
            toast.success(t('toasts.delete'));
            dispatch(channelActions.updateChannel());  
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
                  value={values.channelName}
                  innerRef={(el) => {
                    if(!el) {
                      return;
                    } 
                    el.focus();
                    el.select();
                  }}
                />
                <label htmlFor="channelname" className="visually-hidden">
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
