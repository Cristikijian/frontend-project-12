import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    updateChannel: channelsAdapter.updateOne,
    setCurrentChannelId: (state, { payload }) => {
      // eslint-disable-next-line no-param-reassign
      state.currentChannelId = payload;
    },
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors(
  // eslint-disable-next-line comma-dangle
  (state) => state.channels
);
export default channelsSlice.reducer;
