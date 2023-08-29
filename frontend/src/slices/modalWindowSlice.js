import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const modalWindowAdapter = createEntityAdapter();
const initialState = modalWindowAdapter.getInitialState({
  channel: null,
  modalType: null,
});

const modalWindowSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    openModal: (state, { payload }) => ({
      ...state,
      isOpening: true,
      modalType: payload.modalType,
      channel: payload.channel,
    }),
    closeModal: (state) => ({
      ...state,
      isOpening: false,
    }),
  },
});

export const { actions } = modalWindowSlice;
export const selectors = modalWindowAdapter.getSelectors(
  // eslint-disable-next-line comma-dangle
  (state) => state.modalWindow
);
export default modalWindowSlice.reducer;
