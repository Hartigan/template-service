import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer, IAuthContentState } from '../components/auth/AuthContentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});

export interface IAppState {
    auth: IAuthContentState;
}

export const authSelector = (state: IAppState) : IAuthContentState => state.auth;