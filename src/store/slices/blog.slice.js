import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlog: (state, action) => action.payload,
  },
});

export const { setBlog } = blogSlice.actions;

export default blogSlice.reducer;

export const blogThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${apiConfig().endpoint}/blog/`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setBlog(res.data.blogs)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
