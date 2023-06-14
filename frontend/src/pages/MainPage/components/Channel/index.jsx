import React, { useContext } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../../context';

const Channel = ({ channel, currentChannel, onChannelSelect, onChannelRemove, onChannelRename }) => {
  const context = useContext(UserContext);
  const { t } = useTranslation();

  const isActive = channel.id === currentChannel.id;
  return  <li className="nav-item w-100" key={channel.name}>
    {channel.author !== context.username && 
      <Button className="w-100 rounded-0 text-start btn" variant={isActive ? 'secondary' : 'default'} onClick={() => onChannelSelect(channel.id)}>
        <span className="me-1">#</span>{channel.name}
      </Button>}
    {channel.author === context.username && 
       <Dropdown as={ButtonGroup} className='d-flex dropdown btn-group'>
       <Button variant={isActive ? 'secondary' : ''} className='rounded-0 w-100 text-start text-truncate' onClick={() => onChannelSelect(channel.id)}>
        {<span className="me-1">#</span>}{channel.name}</Button>
       <Dropdown.Toggle split variant={isActive ? 'secondary' : ''}>
        <span class="visually-hidden">{t("channels.channelControl")}</span>
        </Dropdown.Toggle>
       <Dropdown.Menu>
         <Dropdown.Item eventKey="1" onClick={() => onChannelRemove(channel.id)}>{t('buttons.delete')}</Dropdown.Item>
         <Dropdown.Item eventKey="2" onClick={() => onChannelRename(channel)}>{t('buttons.rename')}</Dropdown.Item>
       </Dropdown.Menu>
     </Dropdown>}
    </li>
};

export default Channel;