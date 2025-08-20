import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const publicSlice = createSlice({
  name: 'publicData',
  initialState: {},
  reducers: {
    setPublic: (state, action) => action.payload,
  },
});

export const { setPublic } = publicSlice.actions;

export default publicSlice.reducer;

export const publicThunk = () => (dispatch) => {
  dispatch(setLoad(false));
  const url = `${apiConfig().endpoint}/public/`;
  axios
    .get(url, apiConfig().axios)
    .then((res) => {
      dispatch(setPublic(res.data));
    })
    .catch((err) => appError(err))
    .finally(() => dispatch(setLoad(true)));
};
