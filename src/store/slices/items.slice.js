import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const itemSlice = createSlice({
  name: 'items',
  initialState: [],
  reducers: {
    setItems: (state, action) => action.payload,
  },
});

export const { setItems } = itemSlice.actions;

export default itemSlice.reducer;

export const itemsThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/items/`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setItems(res.data.items)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
