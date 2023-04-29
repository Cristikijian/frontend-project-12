import React from 'react';
import { useSelector } from 'react-redux';
import Chat from '../Chat';
import { selectors } from '../../slices/chatsSlice';

const Chats = () => {
  const chats = useSelector(selectors.selectAll);
  console.log(chats);
  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {chats.map((chat) => (
        <Chat key={chat.id} chat={chat} />
      ))}
    </ul>
  );
};

export default Chats;