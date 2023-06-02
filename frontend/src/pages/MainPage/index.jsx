import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";
import { UserContext } from "../../context";
import axios from "axios";
import Normalizer from "../../utils/normalizer";
import { actions as channelActions, selectors as channelSelectors } from "../../slices/channelsSlice"
import Channel from "./components/Channel";
import ChatContainer from "./components/ChatContainer";
import AddChannelModal from "./components/AddChannelModal";
import DeleteChannelModal from "./components/DeleteChannelModal";
import RenameChannelModal from "./components/RenameChannelModal";
import ioClient from "../../servicesSocket/socket";


const MainPage = () => {
  const context = useContext(UserContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const channels = useSelector(channelSelectors.selectAll);
  const defaultChannel = useRef(null);

  useEffect(() => {
    if(!context.token) {
      navigate('login');
      return;
    }
    const fetchData = async () => {
      const {data} = await axios.get('/api/v1/data', { headers: {'Authorization': `Bearer ${context.token}`}});
      const normalizedData = Normalizer(data.channels);
      const { channels } = normalizedData.entities;
      defaultChannel.current = data.channels[0].id;

      dispatch(channelActions.addChannels(channels));
      dispatch(channelActions.setCurrentChannelId(data.currentChannelId));
    }

    fetchData();
    
    ioClient.on('removeChannel', (payload) => {
      console.log(payload.id);

      dispatch(channelActions.setCurrentChannelId(defaultChannel.current));
      dispatch(channelActions.removeChannel(payload.id));
    });

    ioClient.on('renameChannel', (payload) => {
      console.log(payload);
      dispatch(channelActions.updateChannel(payload))
    });

    ioClient.on('newChannel', (payload) => {
      console.log(payload); // { id: 6, name: "new channel", removable: true }
      dispatch(channelActions.setCurrentChannelId(payload.id));
      dispatch(channelActions.addChannel(payload));
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  


  
  const currentChannel = useSelector((state) => { 
    const currentChannelId = state.channels.currentChannelId;
    return channelSelectors.selectById(state, currentChannelId);
  });

  const [removeableChannel, setRemoveableChannel] = useState();
  const [renameableChannel, setRenameableChannel] = useState();
  
  const handleChannelSelect = (id) => {
    dispatch(channelActions.setCurrentChannelId(id));
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
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
    <DeleteChannelModal show={Boolean(removeableChannel)} onHide={() => setRemoveableChannel(null)} id={removeableChannel}/>
    <RenameChannelModal show={Boolean(renameableChannel)} onHide={() => setRenameableChannel(null)} channel={renameableChannel}/>
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>Каналы</b>
                <button type="button" variant="primary" onClick={handleShow} className="p-0 text-primary btn btn-group-vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
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
                    onChannelRename = {handleRenameableChannel}/>
                ))}
              </ul>
            </div>
            {currentChannel && <ChatContainer channel={currentChannel}/>}
          </div>
        </div>
    </>
  );
}

export default MainPage;