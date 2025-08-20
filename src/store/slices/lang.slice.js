import { createSlice } from '@reduxjs/toolkit';

const langSlice = createSlice({
  name: 'lang',
  initialState: 'en',
  reducers: {
    setLang: (state, action) => action.payload,
  },
});

export const { setLang } = langSlice.actions;

export default langSlice.reducer;

export const langThunk =
  (value) => (dispatch) => {
    localStorage.setItem('lang', value || 'en');
    dispatch(setLang(value));
  };
