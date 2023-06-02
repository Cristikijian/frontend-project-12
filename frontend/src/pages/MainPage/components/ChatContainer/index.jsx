import React, { useEffect } from "react";
import Message from "../Message";
import MessageForm from "../MessageForm";
import { useSelector, useDispatch } from "react-redux";
import { actions as messagesActions, selectors as messagesSelectors } from "../../../../slices/messagesSlice";
import ioClient from "../../../../servicesSocket/socket";


const ChatContainer = ({ channel }) => {
  
  const messages = useSelector(messagesSelectors.selectAll);
  const filtredMessages = messages.filter((message) => channel.id === message.channelId)
  const dispatch = useDispatch();
  
  useEffect(() => {
    ioClient.on('newMessage', (message) => {
      console.log(message);
      dispatch(messagesActions.addMessage(message))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="col p-0 h-100">
  <div className="d-flex flex-column h-100">
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0"><b># {channel.name}</b></p>
      <span className="text-muted">0 сообщений</span>
    </div>
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">{filtredMessages.map((message) => <Message message={message} key={message.id}/>)}</div>
    <div className="mt-auto px-5 py-3">
      <MessageForm channel={channel}/>
    </div>
  </div>
</div>
};

export default ChatContainer;