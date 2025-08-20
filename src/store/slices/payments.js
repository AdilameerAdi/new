import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const paymentSlice = createSlice({
  name: 'payments',
  initialState: [],
  reducers: {
    setPayments: (state, action) =>
      action.payload,
  },
});

export const { setPayments } =
  paymentSlice.actions;

export default paymentSlice.reducer;

export const paymentsThunk =
  (admin = false) =>
  async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/payments/${
      admin ? 'admin' : 'user'
    }`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setPayments(res.data)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
