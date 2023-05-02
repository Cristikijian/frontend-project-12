import React from 'react';
import cn from 'classnames';

const Channel = ({ channel, currentChannel, onChannelSelect }) => {

  const buttonClass = cn('w-100', 'rounded-0', 'text-start', 'btn', {'btn-secondary': channel.id === currentChannel.id })
  
  return  <li className="nav-item w-100">
      <button type="button" className={buttonClass} onClick={() => onChannelSelect(channel.id)}>
      <span className="me-1">#</span>{channel.name}
      </button>
    </li>
};

export default Channel;