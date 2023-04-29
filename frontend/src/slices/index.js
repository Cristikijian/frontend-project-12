
import { configureStore } from '@reduxjs/toolkit';
import chatsSlice from './chatsSlice';

const store = configureStore({
  reducer: {
    chats: chatsSlice,
  },
});

export default store;