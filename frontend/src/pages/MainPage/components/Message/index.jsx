import leoProfanity from 'leo-profanity';
import React from 'react';

const Message = ({ message }) => (
  <div className="text-break mb-2">
    <b>{message.username}</b>
    :
    {' '}
    {leoProfanity.clean(message.body)}
  </div>
);

export default Message;
