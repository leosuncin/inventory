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
  'fetchStatus',
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
/**
 * @type import('@reduxjs/toolkit').AsyncThunk<any, {product: string; category: string; quantityOrder: number; unitCost: number; type: 'IN'}, any>
 */
export const addEntry = createAsyncThunk(
  'inventories/addEntry',
  async (entry, thunkAPI) => {
    try {
      const resp = await fetch('/api/inventories', {
        method: 'POST',
        body: JSON.stringify(entry),
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
        inventoriesAdapter.addMany(state, action.payload.docs);
        state.loadingStatus = 'loaded';
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      })
      .addCase(addEntry.pending, state => {
        state.loadingStatus = 'adding';
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        inventoriesAdapter.addOne(state, action.payload);
        state.loadingStatus = 'added';
      })
      .addCase(addEntry.rejected, (state, action) => {
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
