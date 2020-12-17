import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GroupId } from '../../../models/Identificators';
import { Group } from '../../../models/Permissions';
import { groupService } from '../../../Services';

export interface IGroupsListViewState {
    data: {
        loading: 'idle' | 'pending' | 'succeeded';
        groups: Array<Group>;
    };
    selectedGroup: GroupId | null;
};

export const fetchGroups = createAsyncThunk(
    `groups/list/fetchGroups`,
    async () => {
        const groups = await groupService.getGroups({
            admin: true,
            read: false,
            write: false,
            generate: false
        });
        return groups;
    }
);

const slice = createSlice({
    name: 'groups-list-view',
    initialState: {
        data: {
            loading: 'idle',
            groups: [],
        },
        selectedGroup: null,
    } as IGroupsListViewState,
    reducers: {
        selectGroup: (state, action: PayloadAction<GroupId | null>) => {
            state.selectedGroup = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.data = {
                    groups: action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(fetchGroups.pending, (state) => {
                state.data = {
                    ...state.data,
                    loading: 'pending'
                };
            });
    }
});

export const {
    selectGroup,
} = slice.actions;

export const groupsListViewReducer = slice.reducer;