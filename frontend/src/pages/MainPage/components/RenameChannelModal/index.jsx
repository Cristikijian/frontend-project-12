import React, { useContext} from "react";
import { Modal, Button } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as Yup from 'yup';
import ioClient from "../../../../servicesSocket/socket";
import { actions as channelActions } from "../../../../slices/channelsSlice"
import { UserContext } from "../../../../context";


const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const context = useContext(UserContext);
  if(!channel) {
    return null;
  }

  console.log(channel);
  const uniqChannelNameSchema = Yup.object().shape({
    channel: Yup.string().required().test('uniqChannel',
      () => 'Должно быть уникальным',
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
            dispatch(channelActions.updateChannel());
          } catch (e) {
            console.error(e);
          }
        }}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Modal.Header closeButton onHide={onHide}>
              <Modal.Title>Переименовать канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {errors.uniqChannel}
                <Field
                  name="channeName"
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
                Отменить
              </Button>
              <Button variant="primary" type="submit">
                Отправить
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
