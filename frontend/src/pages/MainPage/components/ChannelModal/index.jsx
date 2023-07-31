import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalWindowActions } from '../../../../slices/modalWindowSlice';
import AddChannelModal from '../AddChannelModal';
import DeleteChannelModal from '../DeleteChannelModal';
import RenameChannelModal from '../RenameChannelModal';

const ChannelModal = () => {
  const dispatch = useDispatch();
  const isOpening = useSelector((state) => state.modalWindow.isOpening);
  const modalType = useSelector((state) => state.modalWindow.modalType);
  const handleClose = () => {
    dispatch(modalWindowActions.setIsOpening(false));
  };
  switch (modalType) {
    case 'add': {
      return <AddChannelModal show={isOpening} onHide={handleClose} />;
    }
    case 'remove': {
      return <DeleteChannelModal show={isOpening} onHide={handleClose} />;
    }
    case 'rename': {
      return <RenameChannelModal show={isOpening} onHide={handleClose} />;
    }
    default: {
      return null;
    }
  }
};

export default ChannelModal;
