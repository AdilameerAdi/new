import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const planSlice = createSlice({
  name: 'plans',
  initialState: [],
  reducers: {
    setPlan: (state, action) => action.payload,
  },
});

export const { setPlan } = planSlice.actions;

export default planSlice.reducer;

export const planThunk =
  (admin = false) =>
  (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/plans/${
      admin ? 'admin' : ''
    }`;
    axios
      .get(url, apiConfig().axios)
      .then((res) => dispatch(setPlan(res.data)))
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
