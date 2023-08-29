import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions as channelActions } from '../../../../slices/channelsSlice';
import { actions as modalWindowActions } from '../../../../slices/modalWindowSlice';

const Channel = ({ channel, currentChannel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleChannelSelect = (id) => {
    dispatch(channelActions.setCurrentChannelId(id));
  };
  console.log(channel, 'channel');

  const isActive = channel.id === currentChannel.id;
  return (
    <li className="nav-item w-100" key={channel.name}>
      {channel.removable === false
      && (
      <Button className="w-100 rounded-0 text-start btn" variant={isActive ? 'secondary' : 'default'} onClick={() => handleChannelSelect(channel.id)}>
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      )}
      {channel.removable === true
       && (
       <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
         <Button variant={isActive ? 'secondary' : ''} className="rounded-0 w-100 text-start text-truncate" onClick={() => handleChannelSelect(channel.id)}>
           <span className="me-1">#</span>
           {channel.name}
         </Button>
         <Dropdown.Toggle split variant={isActive ? 'secondary' : ''}>
           <span className="visually-hidden">{t('channels.channelControl')}</span>
         </Dropdown.Toggle>
         <Dropdown.Menu>
           <Dropdown.Item
             eventKey="1"
             onClick={() => {
               dispatch(modalWindowActions.openModal(({ modalType: 'remove', channel })));
             }}
           >
             {t('buttons.delete')}

           </Dropdown.Item>
           <Dropdown.Item
             eventKey="2"
             onClick={() => {
               dispatch(modalWindowActions.openModal({ modalType: 'rename', channel }));
             }}
           >
             {t('buttons.rename')}
           </Dropdown.Item>
         </Dropdown.Menu>
       </Dropdown>
       )}
    </li>
  );
};

export default Channel;
