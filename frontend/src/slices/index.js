
import { configureStore } from '@reduxjs/toolkit';
import channelsSlice from './channelsSlice';

const store = configureStore({
  reducer: {
    channels: channelsSlice,
  },
});

export default store;