import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const couponSlice = createSlice({
  name: 'coupons',
  initialState: [],
  reducers: {
    setCoupons: (state, action) => action.payload,
  },
});

export const { setCoupons } = couponSlice.actions;

export default couponSlice.reducer;

export const couponsThunk =
  (admin = false) =>
  (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/coupons/${admin ? 'admin' : ''}`;
    axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setCoupons(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
