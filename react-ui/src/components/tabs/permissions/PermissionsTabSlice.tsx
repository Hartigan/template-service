import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum PermissionsTabTabs {
    FileTree = 0,
    HeadSearch = 1,
    ReportSearch = 2,
};

export interface IPermissionsTabState {
    selected: PermissionsTabTabs;
};

const slice = createSlice({
    name: 'permissions-tab',
    initialState: {
        selected: PermissionsTabTabs.FileTree,
    } as IPermissionsTabState,
    reducers: {
        openPermissionsTab: (state) => {
        },
        selectTab: (state, action: PayloadAction<PermissionsTabTabs>) => {
            state.selected = action.payload;
        }
    },
});

export const {
    openPermissionsTab,
    selectTab,
} = slice.actions;

export const permissionsTabReducer = slice.reducer;