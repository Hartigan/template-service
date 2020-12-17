import { createSlice } from '@reduxjs/toolkit'

export interface IGroupsTabState {
};

const slice = createSlice({
    name: 'group-tab',
    initialState: {
    } as IGroupsTabState,
    reducers: {
    },
});

export const groupsTabReducer = slice.reducer;