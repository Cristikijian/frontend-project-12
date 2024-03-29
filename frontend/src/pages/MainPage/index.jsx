import axios from 'axios';
import React, {
  useContext, useEffect, useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../authContext';
import { apiRoutes, appRoutes } from '../../routes';
import { actions as channelActions, selectors as channelSelectors } from '../../slices/channelsSlice';
import { actions as modalWindowActions } from '../../slices/modalWindowSlice';
import { SocketsContext } from '../../socketsContext';
import Channel from './components/Channel';
import ChannelModal from './components/ChannelModal';
import ChatContainer from './components/ChatContainer';

const MainPage = () => {
  const {
    token, username, logout,
  } = useContext(AuthContext);
  const { onRemoveChannel, onRenameChannel, onAddChannel } = useContext(SocketsContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const channels = useSelector(channelSelectors.selectAll);
  const defaultChannel = useRef(null);

  const currentChannel = useSelector((state) => {
    const { currentChannelId } = state.channels;
    return channelSelectors.selectById(state, currentChannelId);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(apiRoutes.channels, { headers: { Authorization: `Bearer ${token}` } });

        defaultChannel.current = data.channels[0].id;

        dispatch(channelActions.addChannels(data.channels));
        dispatch(channelActions.setCurrentChannelId(data.currentChannelId));
      } catch (e) {
        if (e.response.status === 401) {
          logout();
          navigate(appRoutes.login);
          return;
        }
        toast.error(t('errors.network'));
      }
    };

    fetchData();

    onRemoveChannel((payload) => {
      dispatch(channelActions.setCurrentChannelId(defaultChannel.current));
      dispatch(channelActions.removeChannel(payload.id));
    });

    onRenameChannel((payload) => {
      dispatch(channelActions.updateChannel({ id: payload.id, changes: { name: payload.name } }));
    });

    onAddChannel((payload) => {
      if (payload.author === username) {
        dispatch(channelActions.setCurrentChannelId(payload.id));
      }
      dispatch(channelActions.addChannel(payload));
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddChannelModal = () => {
    dispatch(modalWindowActions.openModal({ modalType: 'add' }));
  };

  return (
    <>
      <ChannelModal defaultChannel={defaultChannel.current} />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('channels.channels')}</b>
              <button type="button" onClick={openAddChannelModal} className="p-0 text-primary btn btn-group-vertical">
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
