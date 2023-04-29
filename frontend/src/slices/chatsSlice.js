import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';

const chatsAdapter = createEntityAdapter();
const initialState = chatsAdapter.getInitialState();

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: chatsAdapter.addOne,
  },
});

export const { actions } = chatsSlice;
export const selectors = chatsAdapter.getSelectors((state) => state.chats);
export default chatsSlice.reducer;