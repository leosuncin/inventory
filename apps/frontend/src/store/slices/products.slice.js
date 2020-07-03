import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

export const PRODUCTS_FEATURE_KEY = 'products';
export const productsAdapter = createEntityAdapter();
/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchProducts())
 * }, [dispatch]);
 * ```
 * @type import('@reduxjs/toolkit').AsyncThunk<any, {page: number; limit?: number}, any>
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchStatus',
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const resp = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const json = resp.json();

      return json;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
/**
 * @type import('@reduxjs/toolkit').AsyncThunk<any, {name: string; category: string;}, any>
 */
export const saveProduct = createAsyncThunk(
  'products/saveStatus',
  async (data, thunkAPI) => {
    try {
      const resp = await fetch(`/api/products`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        mode: 'cors',
      });

      if (resp.status === 201) return resp.json();
      else {
        try {
          const result = await resp.text();
          const error = JSON.parse(result);

          return thunkAPI.rejectWithValue(error.message);
        } catch (error) {
          return thunkAPI.rejectWithValue(resp.statusText);
        }
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const initialProductsState = productsAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
});
export const productsSlice = createSlice({
  name: PRODUCTS_FEATURE_KEY,
  initialState: initialProductsState,
  reducers: {
    add: productsAdapter.addOne,
    remove: productsAdapter.removeOne,
    // ...
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        productsAdapter.addMany(state, action.payload.docs);
        state.loadingStatus = 'loaded';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      })
      .addCase(saveProduct.pending, state => {
        state.loadingStatus = 'saving';
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        productsAdapter.addOne(state, action.payload);
        state.loadingStatus = 'saved';
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error;
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const productsReducer = productsSlice.reducer;
/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(productsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const productsActions = productsSlice.actions;
/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllProducts);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = productsAdapter.getSelectors();
export const getProductsState = rootState => rootState[PRODUCTS_FEATURE_KEY];
export const selectAllProducts = createSelector(getProductsState, selectAll);
export const selectProductsEntities = createSelector(
  getProductsState,
  selectEntities,
);
