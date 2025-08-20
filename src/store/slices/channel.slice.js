import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const channelSlice = createSlice({
  name: 'channels',
  initialState: {},
  reducers: {
    setChannels: (state, action) =>
      action.payload,
  },
});

export const { setChannels } =
  channelSlice.actions;

export default channelSlice.reducer;

export const channelsThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/channels/`;
    await axios
      .get(url)
      .then((res) => {
        dispatch(setChannels(res.data));
      })
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
