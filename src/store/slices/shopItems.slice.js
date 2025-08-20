import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const shopItemSlice = createSlice({
  name: 'shopItems',
  initialState: [],
  reducers: {
    setShopItems: (state, action) =>
      action.payload,
  },
});

export const { setShopItems } =
  shopItemSlice.actions;

export default shopItemSlice.reducer;

export const shopItemsThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/shop`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setShopItems(res.data)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
