import { createSlice } from '@reduxjs/toolkit'

export interface IFilesToolbarState {
};

const slice = createSlice({
    name: 'files-toolbar',
    initialState: {
    } as IFilesToolbarState,
    reducers: {
    },
});

export const filesToolbarReducer = slice.reducer;