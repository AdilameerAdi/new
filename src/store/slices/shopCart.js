import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const shopCartSlice = createSlice({
  name: 'shopCart',
  initialState: [],
  reducers: {
    setShopCart: (state, action) =>
      action.payload,
  },
});

export const { setShopCart } =
  shopCartSlice.actions;

export default shopCartSlice.reducer;

export const shopCartThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/cart/`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(
          setShopCart(res.data.shopCartItems),
        );
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
