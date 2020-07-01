import { configureStore } from '@reduxjs/toolkit';

import {
  CATEGORIES_FEATURE_KEY,
  categoriesReducer,
} from './slices/categories.slice';
import {
  INVENTORIES_FEATURE_KEY,
  inventoriesReducer,
} from './slices/inventories.slice';
import { PRODUCTS_FEATURE_KEY, productsReducer } from './slices/products.slice';

const store = configureStore({
  reducer: {
    [CATEGORIES_FEATURE_KEY]: categoriesReducer,
    [PRODUCTS_FEATURE_KEY]: productsReducer,
    [INVENTORIES_FEATURE_KEY]: inventoriesReducer,
  },
  devTools: true,
});

export default store;
