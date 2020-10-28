import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authReducer, IAuthContentState } from '../components/auth/AuthContentSlice';
import { filesToolbarReducer, IFilesToolbarState } from '../components/files/toolbar/FilesToolbarSlice';
import { editorTabReducer, IEditorTabState } from '../components/tabs/editor/EditorTabSlice';
import { IReportsTabState, reportsTabReducer } from '../components/tabs/reports/ReportsTabSlice';
import { ITrainTabState, trainTabReducer } from '../components/tabs/train/TrainTabSlice';

const editorReducer = combineReducers({
    root: editorTabReducer,
    filesToolbar: filesToolbarReducer,
});

export const store = configureStore({
    reducer: {
        auth: authReducer,
        reports: reportsTabReducer,
        train: trainTabReducer,
        editor: editorReducer
    }
});

export interface IAppState {
    auth: IAuthContentState;
    reports: IReportsTabState;
    train: ITrainTabState;
    editor: {
        root: IEditorTabState;
        filesToolbar: IFilesToolbarState;
    }
}

export const authSelector = (state: IAppState) : IAuthContentState => state.auth;
export const reportsTabSelector = (state: IAppState) : IReportsTabState => state.reports;
export const trainTabSelector = (state: IAppState) : ITrainTabState => state.train;
export const editorTabSelector = (state: IAppState) : IEditorTabState => state.editor.root;
export const filesToolbarSelector = (state: IAppState) : IFilesToolbarState => state.editor.filesToolbar;