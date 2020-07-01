import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

export const INVENTORIES_FEATURE_KEY = 'inventories';
export const inventoriesAdapter = createEntityAdapter();
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
 *   dispatch(fetchInventories())
 * }, [dispatch]);
 * ```
 */
export const fetchInventories = createAsyncThunk(
  'inventories/fetchStatus',
  async (_, thunkAPI) => {
    try {
      const resp = await fetch('/api/inventories');
      const json = resp.json();

      return json;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const initialInventoriesState = inventoriesAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
});
export const inventoriesSlice = createSlice({
  name: INVENTORIES_FEATURE_KEY,
  initialState: initialInventoriesState,
  reducers: {
    add: inventoriesAdapter.addOne,
    remove: inventoriesAdapter.removeOne,
    // ...
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInventories.pending, state => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        inventoriesAdapter.setAll(state, action.payload.docs);
        state.loadingStatus = 'loaded';
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const inventoriesReducer = inventoriesSlice.reducer;
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
 *   dispatch(inventoriesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const inventoriesActions = inventoriesSlice.actions;
/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllInventories);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = inventoriesAdapter.getSelectors();
export const getInventoriesState = rootState =>
  rootState[INVENTORIES_FEATURE_KEY];
export const selectAllInventories = createSelector(
  getInventoriesState,
  selectAll,
);
export const selectInventoriesEntities = createSelector(
  getInventoriesState,
  selectEntities,
);
