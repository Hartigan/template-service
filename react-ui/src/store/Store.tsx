import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer, IAuthContentState } from '../components/auth/AuthContentSlice';
import { IReportsTabState, reportsTabReducer } from '../components/tabs/reports/ReportsTabSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        reports: reportsTabReducer,
    }
});

export interface IAppState {
    auth: IAuthContentState;
    reports: IReportsTabState;
}

export const authSelector = (state: IAppState) : IAuthContentState => state.auth;
export const reportsTabSelector = (state: IAppState) : IReportsTabState => state.reports;