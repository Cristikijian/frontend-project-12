import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as chatsActions } from '../../slices/chatsSlice';
import { selectors } from '../../slices/chatsSlice';

const Chat = ({ chat }) => {
  
  return  <li className="nav-item w-100">
      <button type="button" className="w-100 rounded-0 text-start btn btn-secondary">
      <span className="me-1">#</span>{chat.name}
      </button>
    </li>
};

export default Chat;