import axios from 'axios';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { UserContext } from '../../context';
import { apiRoutes } from '../../routes';
import ioClient from '../../servicesSocket/socket';
import { actions as channelActions, selectors as channelSelectors } from '../../slices/channelsSlice';
import AddChannelModal from './components/AddChannelModal';
import Channel from './components/Channel';
import ChatContainer from './components/ChatContainer';
import DeleteChannelModal from './components/DeleteChannelModal';
import RenameChannelModal from './components/RenameChannelModal';

const MainPage = () => {
  const { token } = useContext(UserContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector(channelSelectors.selectAll);
  const defaultChannel = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(apiRoutes.channels, { headers: { Authorization: `Bearer ${token}` } });

        defaultChannel.current = data.channels[0].id;

        dispatch(channelActions.addChannels(data.channels));
        dispatch(channelActions.setCurrentChannelId(data.currentChannelId));
      } catch (e) {
        console.log(e);
        toast.error(t('errors.network'));
      }
    };

    fetchData();

    ioClient.on('removeChannel', (payload) => {
      dispatch(channelActions.setCurrentChannelId(defaultChannel.current));
      dispatch(channelActions.removeChannel(payload.id));
      toast.success(t('toasts.delete'));
    });

    ioClient.on('renameChannel', (payload) => {
      console.log(payload);
      dispatch(channelActions.updateChannel({ id: payload.id, changes: { name: payload.name } }));
      toast.success(t('toasts.rename'));
    });

    ioClient.on('newChannel', (payload) => {
      dispatch(channelActions.setCurrentChannelId(payload.id));
      dispatch(channelActions.addChannel(payload));
      toast.success(t('toasts.add'));
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentChannel = useSelector((state) => {
    const { currentChannelId } = state.channels;
    return channelSelectors.selectById(state, currentChannelId);
  });

  const [removeableChannel, setRemoveableChannel] = useState();
  const [renameableChannel, setRenameableChannel] = useState();

  const handleChannelSelect = (id) => {
    dispatch(channelActions.setCurrentChannelId(id));
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleRemoveableChannel = (id) => {
    setRemoveableChannel(id);
  };

  const handleRenameableChannel = (channel) => {
    setRenameableChannel(channel);
  };

  return (
    <>
      <AddChannelModal show={show} onHide={handleClose} channels={channels} />
      <DeleteChannelModal
        show={Boolean(removeableChannel)}
        onHide={() => setRemoveableChannel(null)}
        id={removeableChannel}
      />
      <RenameChannelModal
        show={Boolean(renameableChannel)}
        onHide={() => setRenameableChannel(null)}
        channel={renameableChannel}
      />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('channels.channels')}</b>
              <button type="button" onClick={handleShow} className="p-0 text-primary btn btn-group-vertical">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map((channel) => (
                <Channel
                  key={`channel-${channel.id}`}
                  channel={channel}
                  currentChannel={currentChannel}
                  onChannelSelect={handleChannelSelect}
                  onChannelRemove={handleRemoveableChannel}
                  onChannelRename={handleRenameableChannel}
                />
              ))}
            </ul>
          </div>
          {currentChannel && <ChatContainer channel={currentChannel} />}
        </div>
      </div>
    </>
  );
};

export default MainPage;
