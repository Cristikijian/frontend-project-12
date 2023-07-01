import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const modalWindowAdapter = createEntityAdapter();
const initialState = modalWindowAdapter.getInitialState({
  channel: null,
  actionType: null,
});

const modalWindowSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    setChannel: ({ payload }) => ({
      channel: payload.channel,
      actionType: payload.actionType,
    }),
    clearChannel: () => initialState,
  },
});

export const { actions } = modalWindowSlice;
export const selectors = modalWindowAdapter.getSelectors(
  // eslint-disable-next-line comma-dangle
  (state) => state.modalWindow
);
export default modalWindowSlice.reducer;
