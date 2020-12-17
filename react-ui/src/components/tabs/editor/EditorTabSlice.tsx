import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum EditorTabTabs {
    FileTree = 0,
    HeadSearch = 1,
};

export interface IEditorTabState {
    selected: EditorTabTabs;
};

const slice = createSlice({
    name: 'editor-tab',
    initialState: {
        selected: EditorTabTabs.FileTree,
    } as IEditorTabState,
    reducers: {
        selectTab: (state, action: PayloadAction<EditorTabTabs>) => {
            state.selected = action.payload;
        }
    },
});

export const {
    selectTab,
} = slice.actions;

export const editorTabReducer = slice.reducer;