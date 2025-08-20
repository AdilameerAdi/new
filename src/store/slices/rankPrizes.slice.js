import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const rankPrizeSlice = createSlice({
  name: 'rankPrizes',
  initialState: [],
  reducers: {
    setRankPrizes: (state, action) =>
      action.payload,
  },
});

export const { setRankPrizes } =
  rankPrizeSlice.actions;

export default rankPrizeSlice.reducer;

export const rankPrizesThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/ranking/prizes`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setRankPrizes(res.data[0]));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
