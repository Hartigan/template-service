import { configureStore } from '@reduxjs/toolkit'
import { authReducer, IAuthContentState } from './auth/AuthContentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

export const authSelector = (state) : IAuthContentState => state.auth;