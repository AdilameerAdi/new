import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import appError from '../../utils/appError';
import axios from 'axios';

const shopWeeklyItemSlice = createSlice({
  name: 'shopWeeklyItems',
  initialState: [],
  reducers: {
    setShopWeeklyItems: (state, action) =>
      action.payload,
  },
});

export const { setShopWeeklyItems } =
  shopWeeklyItemSlice.actions;

export default shopWeeklyItemSlice.reducer;

export const shopWeeklyItemsThunk =
  (admin = false) =>
  async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/shop/weekly/${admin ? 'items' : 'item'}`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setShopWeeklyItems(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
