import React, { useContext } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { UserContext } from '../../../../context';
import { actions as modalWindowActions } from '../../../slices/channelsSlice';

const Channel = ({
  channel, currentChannel, onChannelSelect,
}) => {
  const { username } = useContext(UserContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isActive = channel.id === currentChannel.id;
  return (
    <li className="nav-item w-100" key={channel.name}>
      {channel.author !== username
      && (
      <Button className="w-100 rounded-0 text-start btn" variant={isActive ? 'secondary' : 'default'} onClick={() => onChannelSelect(channel.id)}>
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      )}
      {channel.author === username
       && (
       <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
         <Button variant={isActive ? 'secondary' : ''} className="rounded-0 w-100 text-start text-truncate" onClick={() => onChannelSelect(channel.id)}>
           <span className="me-1">#</span>
           {channel.name}
         </Button>
         <Dropdown.Toggle split variant={isActive ? 'secondary' : ''}>
           <span className="visually-hidden">{t('channels.channelControl')}</span>
         </Dropdown.Toggle>
         <Dropdown.Menu>
           <Dropdown.Item eventKey="1" onClick={() => dispatch(modalWindowActions.setChannel({ channel, actionType: 'remove' }))}>{t('buttons.delete')}</Dropdown.Item>
           <Dropdown.Item eventKey="2" onClick={() => dispatch(modalWindowActions.setChannel({ channel, actionType: 'rename' }))}>{t('buttons.rename')}</Dropdown.Item>
         </Dropdown.Menu>
       </Dropdown>
       )}
    </li>
  );
};

export default Channel;
