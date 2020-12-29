import { createSlice } from '@reduxjs/toolkit'

export interface IGroupsTabState {
};

const slice = createSlice({
    name: 'group-tab',
    initialState: {
    } as IGroupsTabState,
    reducers: {
        openGroupsTab: (state) => {
        }
    },
});

export const {
    openGroupsTab
} = slice.actions;

export const groupsTabReducer = slice.reducer;