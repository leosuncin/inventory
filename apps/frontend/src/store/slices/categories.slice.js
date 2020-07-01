import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

export const CATEGORIES_FEATURE_KEY = 'categories';
export const categoriesAdapter = createEntityAdapter({
  selectId: category => category._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
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
 *   dispatch(fetchCategories())
 * }, [dispatch]);
 * ```
 */
export const fetchCategories = createAsyncThunk(
  'categories/fetchStatus',
  async (_, thunkAPI) => {
    try {
      const resp = await fetch('/api/categories');
      const json = resp.json();

      return json;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
/**
 * @type import('@reduxjs/toolkit').AsyncThunk<any, {name: string; color: string;}, any>
 */
export const saveCategory = createAsyncThunk(
  'categories/saveStatus',
  async (data, thunkAPI) => {
    try {
      const resp = await fetch('/api/categories', {
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
export const initialCategoriesState = categoriesAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
});
export const categoriesSlice = createSlice({
  name: CATEGORIES_FEATURE_KEY,
  initialState: initialCategoriesState,
  reducers: {
    add: categoriesAdapter.addOne,
    remove: categoriesAdapter.removeOne,
    // ...
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        categoriesAdapter.setAll(state, action.payload);
        state.loadingStatus = 'loaded';
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      })
      .addCase(saveCategory.pending, state => {
        state.loadingStatus = 'saving';
      })
      .addCase(saveCategory.fulfilled, (state, action) => {
        categoriesAdapter.addOne(state, action.payload);
        state.loadingStatus = 'saved';
      })
      .addCase(saveCategory.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error;
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const categoriesReducer = categoriesSlice.reducer;
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
 *   dispatch(categoriesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const categoriesActions = categoriesSlice.actions;
/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllCategories);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = categoriesAdapter.getSelectors();
export const getCategoriesState = rootState =>
  rootState[CATEGORIES_FEATURE_KEY];
export const selectAllCategories = createSelector(
  getCategoriesState,
  selectAll,
);
export const selectCategoriesEntities = createSelector(
  getCategoriesState,
  selectEntities,
);
