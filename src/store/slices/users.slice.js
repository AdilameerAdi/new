import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => action.payload,
  },
});

export const { setUsers } = userSlice.actions;

export default userSlice.reducer;

export const usersThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/admin/accounts`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) => dispatch(setUsers(res.data)))
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
