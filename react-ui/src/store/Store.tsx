import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer, IAuthContentState } from '../components/auth/AuthContentSlice';
import { IReportsTabState, reportsTabReducer } from '../components/tabs/reports/ReportsTabSlice';
import { ITrainTabState, trainTabReducer } from '../components/tabs/train/TrainTabSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        reports: reportsTabReducer,
        train: trainTabReducer,
    }
});

export interface IAppState {
    auth: IAuthContentState;
    reports: IReportsTabState;
    train: ITrainTabState;
}

export const authSelector = (state: IAppState) : IAuthContentState => state.auth;
export const reportsTabSelector = (state: IAppState) : IReportsTabState => state.reports;
export const trainTabSelector = (state: IAppState) : ITrainTabState => state.train;