import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const logSlice = createSlice({
  name: 'logs',
  initialState: [],
  reducers: {
    setLogs: (state, action) => action.payload,
  },
});

export const { setLogs } = logSlice.actions;

export default logSlice.reducer;

export const logsThunk =
  (admin = false) =>
  (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/logs/${
      admin ? 'admin' : ''
    }`;
    axios
      .get(url, apiConfig().axios)
      .then((res) => {
        dispatch(setLogs(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
