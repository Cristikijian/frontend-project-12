import axios from 'axios';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { UserContext } from '../../../../context';
import { apiRoutes } from '../../../../routes';
import { selectors as channelSelectors } from '../../../../slices/channelsSlice';
import { actions as modalWindowActions } from '../../../../slices/modalWindowSlice';
import sockets from '../../../../sockets';

const ChannelModal = () => {
  const [inputRef, setInputRef] = useState();
  const [customError, setCustomError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { actionType, channel } = useSelector(
    (state) => { console.log(state); return state.modalWindow; },
  );
  const { token, username } = useContext(UserContext);
  const dispatch = useDispatch();

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

  const handleClose = () => {
    dispatch(modalWindowActions.clearChannel());
    setCustomError(false);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      setCustomError(false);
      console.log(actionType, channel.id);

      switch (actionType) {
        case 'add': {
          const { data } = await axios.get(apiRoutes.channels, { headers: { Authorization: `Bearer ${token}` } });

          if (data.channels.some((c) => c.name === values.channelName)) {
            setCustomError(t('errors.uniq'));
            return;
          }

          const newChannel = { name: values.channelName, author: username };
          sockets.addChannel(newChannel, () => {
            resetForm();
            handleClose();
          });
          break;
        }

        case 'rename':
          if (channel.name === values.channelName) {
            return;
          }
          if (channels.some((ch) => ch.name === values.channelName)) {
            setCustomError(t('errors.uniq'));
            return;
          }

          sockets.renameChannel({ id: channel.id, name: values.channelName }, () => {
            resetForm();
            handleClose();
          });
          break;
        case 'remove':
          sockets.removeChannel(channel.id, handleClose);
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
    <Modal show={Boolean(channel)}>
      <Formik
        initialValues={{
          channelName: channel ? channel.name : '',
        }}
        validationSchema={channelNameSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, handleChange }) => (
          <Form>
            <Modal.Header
              closeButton
              onHide={handleClose}
            >
              <Modal.Title>{t(`channelModal.title.${actionType}`)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                {actionType !== 'remove' ? (
                  <Field
                    name="channelName"
                    placeholder={t('channels.channelName')}
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
                ) : (
                  <div>
                    <p className="lead">{t('questions.areYouSure')}</p>
                    <div className="invalid-feedback" />
                  </div>
                )}

                <label className="visually-hidden" htmlFor="channelName">{t('channels.channelName')}</label>
                <div className="invalid-feedback">
                  { errors.channelName }
                  { customError }
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={handleClose}
                >
                  {t('buttons.cancel')}
                </Button>
                <Button
                  variant={actionType === 'remove' ? 'danger' : 'primary'}
                  type="submit"
                  disabled={isLoading}
                >
                  {t(`channelModal.buttons.${actionType}`)}
                </Button>
              </div>
            </Modal.Body>

          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ChannelModal;
