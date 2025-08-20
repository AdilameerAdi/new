import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const lotteryBuyerSlice = createSlice({
  name: 'lotteryBuyers',
  initialState: [],
  reducers: {
    setLotteryBuyers: (state, action) =>
      action.payload,
  },
});

export const { setLotteryBuyers } =
  lotteryBuyerSlice.actions;

export default lotteryBuyerSlice.reducer;

export const lotteryBuyersThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/lottery/buyer`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setLotteryBuyers(res.data)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
