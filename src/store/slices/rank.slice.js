import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const rankSlice = createSlice({
  name: 'rank',
  initialState: [],
  reducers: {
    setRank: (state, action) => action.payload,
  },
});

export const { setRank } = rankSlice.actions;

export default rankSlice.reducer;

export const rankThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/ranking`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setRank(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
