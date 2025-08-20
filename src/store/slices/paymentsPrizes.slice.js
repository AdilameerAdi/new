import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const paymentPrizesSlice = createSlice({
  name: 'paymentPrizes',
  initialState: [],
  reducers: {
    setPaymentPrizes: (state, action) =>
      action.payload,
  },
});

export const { setPaymentPrizes } =
  paymentPrizesSlice.actions;

export default paymentPrizesSlice.reducer;

export const paymentPrizesThunk =
  (admin = false) =>
  async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/gems/${
      admin ? 'admin' : 'prizes'
    }`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setPaymentPrizes(res.data)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
