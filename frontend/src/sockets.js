import { io } from 'socket.io-client';

const ioClient = io();

const sockets = {
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

  ioClient.emit('newChannel', newChannel);

  ioClient.emit('removeChannel', { id });

  ioClient.emit('renameChannel', { id: channel.id, name: values.channelName }, cb)
};
export default sockets;