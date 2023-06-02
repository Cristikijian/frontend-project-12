import React, { useContext } from 'react';
import cn from 'classnames';
import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { UserContext } from '../../../../context';

const Channel = ({ channel, currentChannel, onChannelSelect, onChannelRemove, onChannelRename }) => {
  const context = useContext(UserContext);

  const isActive = channel.id === currentChannel.id;
  console.log(currentChannel)
  const buttonClass = cn('w-100', 'rounded-0', 'text-start', 'btn', { 'btn-secondary': isActive });

  return  <li className="nav-item w-100" key={channel.name}>
    {channel.author !== context.username && 
      <button type="button" className={buttonClass} onClick={() => onChannelSelect(channel.id)}>
      <span className="me-1">#</span>{channel.name}
      </button>}
    {channel.author === context.username && 
       <Dropdown as={ButtonGroup} className='d-flex dropdown btn-group'>
       <Button variant={isActive ? 'secondary' : ''} className='rounded-0 w-100 text-start' onClick={() => onChannelSelect(channel.id)}>{`# ${channel.name}`}</Button>
       <Dropdown.Toggle split variant={isActive ? 'secondary' : ''} />
       <Dropdown.Menu>
         <Dropdown.Item eventKey="1" onClick={() => onChannelRemove(channel.id)}>Удалить</Dropdown.Item>
         <Dropdown.Item eventKey="2" onClick={() => onChannelRename(channel)}>Переименовать</Dropdown.Item>
       </Dropdown.Menu>
     </Dropdown>}
    </li>
};

export default Channel;