import { io } from 'socket.io-client';

const getSockets = () => {
  const ioClient = io();

  const sockets = {
    addChannel: (newChannel, cb) => {
      ioClient.emit('newChannel', newChannel, cb);
    },

    onAddChannel: (cb) => {
      ioClient.on('newChannel', cb);
    },

    removeChannel: (id, cb) => {
      ioClient.emit('removeChannel', { id }, cb);
    },

    onRemoveChannel: (cb) => {
      ioClient.on('removeChannel', cb);
    },

    renameChannel: (data, cb) => {
      ioClient.emit('renameChannel', data, cb);
    },

    onRenameChannel: (cb) => {
      ioClient.on('renameChannel', cb);
    },
    newMessage: (message, cb) => {
      console.log(message);
      ioClient.emit('newMessage', message, cb);
    },

    onNewMessage: (cb) => {
      ioClient.on('newMessage', cb);
    },

    onDisconnect: (cb) => {
      ioClient.on('disconnect', cb);
    },
  };

  return sockets;
};

export default getSockets;
