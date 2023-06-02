import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { actions as channelActions } from './channelsSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    },

  extraReducers: (builder) => {
    builder.addCase(channelActions.removeChannel, (state, action) => {
      const channelId = action.payload;
      const allEntities = Object.values(state.entities);
      const restEntities = allEntities.filter((e) => e.channelId !== channelId );
      messagesAdapter.setAll(state, restEntities);
      console.log(restEntities);
    });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;