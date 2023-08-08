/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
});

const DEFAULT_CHANNEL_ID = 1;

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: (state, { payload }) => {
      if (payload === state.currentChannelId) {
        state.currentChannelId = DEFAULT_CHANNEL_ID;
      }

      channelsAdapter.removeOne(state, payload);
    },
    updateChannel: channelsAdapter.updateOne,
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});

export const selectors = channelsAdapter.getSelectors(
  // eslint-disable-next-line comma-dangle
  (state) => state.channels
);
export const { actions } = channelsSlice;

export default channelsSlice.reducer;
