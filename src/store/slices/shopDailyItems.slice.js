import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const shopDailyItemSlice = createSlice({
  name: 'shopDailyItems',
  initialState: [],
  reducers: {
    setShopDailyItems: (state, action) =>
      action.payload,
  },
});

export const { setShopDailyItems } =
  shopDailyItemSlice.actions;

export default shopDailyItemSlice.reducer;

export const shopDailyItemsThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/shop/daily/items`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setShopDailyItems(res.data)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
