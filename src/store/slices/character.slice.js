import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const characterSlice = createSlice({
  name: 'characters',
  initialState: [],
  reducers: {
    setCharacters: (state, action) =>
      action.payload,
  },
});

export const { setCharacters } =
  characterSlice.actions;

export default characterSlice.reducer;

export const charactersThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/characters/`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(
          setCharacters(res.data.characters),
        ),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
