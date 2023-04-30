import React from 'react';

const Channel = ({ channel }) => {
  
  return  <li className="nav-item w-100">
      <button type="button" className="w-100 rounded-0 text-start btn btn-secondary">
      <span className="me-1">#</span>{channel.name}
      </button>
    </li>
};

export default Channel;