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
    setModalType: (state, { payload }) => ({
      ...state,
      modalType: payload.modalType,
    }),
    setIsOpening: (state, { payload }) => ({
      ...state,
      isOpening: payload,
    }),
    setChannel: (state, { payload }) => ({
      ...state,
      channel: payload,
    }),
  },
});

export const { actions } = modalWindowSlice;
export const selectors = modalWindowAdapter.getSelectors(
  // eslint-disable-next-line comma-dangle
  (state) => state.modalWindow
);
export default modalWindowSlice.reducer;
