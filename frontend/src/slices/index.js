
import { configureStore } from '@reduxjs/toolkit';
import channelsSlice from './channelsSlice';
import messagesSlice from './messagesSlice';

const store = configureStore({
  reducer: {
    channels: channelsSlice,
    messages: messagesSlice,
  },
});

export default store;