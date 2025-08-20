import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const wheelItemSlice = createSlice({
  name: 'wheelItems',
  initialState: [],
  reducers: {
    setWheelItems: (state, action) =>
      action.payload,
  },
});

export const { setWheelItems } =
  wheelItemSlice.actions;

export default wheelItemSlice.reducer;

export const wheelItemsThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/wheel`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setWheelItems(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
