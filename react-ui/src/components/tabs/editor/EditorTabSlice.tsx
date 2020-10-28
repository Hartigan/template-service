import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HeadLink } from '../../../models/Folder';

export interface IEditorTabState {
    selectedHead: HeadLink | null;
};

const slice = createSlice({
    name: 'editor-tab',
    initialState: {
        selectedHead: null,
    } as IEditorTabState,
    reducers: {
        selectHead: (state, action: PayloadAction<HeadLink | null>) => {
            state.selectedHead = action.payload;
        }
    },
});

export const {
    selectHead,
} = slice.actions;

export const editorTabReducer = slice.reducer;