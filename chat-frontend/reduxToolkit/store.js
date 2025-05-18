import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser } from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
