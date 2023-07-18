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
    setChannel: (state, { payload }) => ({
      channel: payload.channel,
      actionType: payload.actionType,
    }),
    clearChannel: (state) => ({ channel: null, actionType: state.actionType }),
  },
});

export const { actions } = modalWindowSlice;
export const selectors = modalWindowAdapter.getSelectors(
  // eslint-disable-next-line comma-dangle
  (state) => state.modalWindow
);
export default modalWindowSlice.reducer;
