import { createSlice } from '@reduxjs/toolkit';
import apiConfig from '../../utils/apiConfig';
import { setLoad } from './loader.slice';
import axios from 'axios';
import appError from '../../utils/appError';

const shopCategoriesSlice = createSlice({
  name: 'shopCategories',
  initialState: [],
  reducers: {
    setShopCategories: (state, action) =>
      action.payload,
  },
});

export const { setShopCategories } =
  shopCategoriesSlice.actions;

export default shopCategoriesSlice.reducer;

export const shopCategoriesThunk =
  () => async (dispatch) => {
    dispatch(setLoad(false));
    const url = `${
      apiConfig().endpoint
    }/shop/category/items`;
    await axios
      .get(url, apiConfig().axios)
      .then((res) =>
        dispatch(setShopCategories(res.data)),
      )
      .catch((err) => appError(err))
      .finally(() => dispatch(setLoad(true)));
  };
