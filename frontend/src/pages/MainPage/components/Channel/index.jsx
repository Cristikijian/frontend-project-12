import React, { useContext } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { UserContext } from '../../../../authContext';
import { actions as channelActions } from '../../../../slices/channelsSlice';
import { actions as modalWindowActions } from '../../../../slices/modalWindowSlice';

const Channel = ({ channel, currentChannel }) => {
  const { username } = useContext(UserContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleChannelSelect = (id) => {
    dispatch(channelActions.setCurrentChannelId(id));
  };

  const isActive = channel.id === currentChannel.id;
  return (
    <li className="nav-item w-100" key={channel.name}>
      {channel.author !== username
      && (
      <Button className="w-100 rounded-0 text-start btn" variant={isActive ? 'secondary' : 'default'} onClick={() => handleChannelSelect(channel.id)}>
        <span className="me-1">#</span>
        {channel.name}
      </Button>
      )}
      {channel.author === username
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
               dispatch(modalWindowActions.setModalType({ modalType: 'remove' }));
               dispatch(modalWindowActions.setIsOpening(true));
               dispatch(modalWindowActions.setChannel(channel));
             }}
           >
             {t('buttons.delete')}

           </Dropdown.Item>
           <Dropdown.Item
             eventKey="2"
             onClick={() => {
               dispatch(modalWindowActions.setModalType({ modalType: 'rename' }));
               dispatch(modalWindowActions.setIsOpening(true));
               dispatch(modalWindowActions.setChannel(channel));
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
