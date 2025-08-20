import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const lotterySlice = createSlice({
  name: 'lottery',
  initialState: [],
  reducers: {
    setLottery: (state, action) => action.payload,
  },
});

export const { setLottery } =
  lotterySlice.actions;

export default lotterySlice.reducer;

export const lotteryThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/lottery/event`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setLottery(res.data.lotteries)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
