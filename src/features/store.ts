import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './auth/authSlice';
import filterReducer from './filter/filterSlice';
import reviewReducer from './review/reviewSlice';

/**
 * Root Reducer Configuration
 * @description Combines all feature reducers.
 */
const rootReducer = {
  auth: authReducer,
  filter: filterReducer,
  review: reviewReducer,
};

/**
 * Redux Store Configuration
 * @description Centralized state management using Redux Toolkit.
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
