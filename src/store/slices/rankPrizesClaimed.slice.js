import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const rankPrizeClaimedSlice = createSlice({
  name: 'rankPrizesClaimed',
  initialState: [],
  reducers: {
    setRankPrizesClaimed: (state, action) =>
      action.payload,
  },
});

export const { setRankPrizesClaimed } =
  rankPrizeClaimedSlice.actions;

export default rankPrizeClaimedSlice.reducer;

export const rankPrizesClaimedThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/ranking/prizes/claimed`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setRankPrizesClaimed(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
