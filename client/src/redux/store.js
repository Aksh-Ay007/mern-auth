import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import adminReducer from './admin/adminSlice'; // Import the admin reducer

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default localStorage

// Combine the reducers for user and admin
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,  // Add admin reducer here
});

// Configure persistence for the whole store, can fine-tune here
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user'],  // Example: Only persist 'user' slice
  // blacklist: ['admin'], // Example: Don't persist admin slice (if needed)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),  // Ensuring redux-persist compatibility
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools only in development
});



export const persistor = persistStore(store);
