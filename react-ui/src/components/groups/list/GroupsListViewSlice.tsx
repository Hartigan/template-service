import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GroupModel } from '../../../models/domain';
import { GroupId } from '../../../models/Identificators';
import { GetGroupsRequest } from '../../../protobuf/groups_pb';
import Services from '../../../Services';

export interface IGroupsListViewState {
    data: {
        loading: 'idle' | 'pending' | 'succeeded';
        groups: Array<GroupModel>;
    };
    selectedGroup: GroupId | null;
};

export const fetchGroups = createAsyncThunk(
    `groups/list/fetchGroups`,
    async () => {
        const request = new GetGroupsRequest();
        request.setAdmin(true);
        request.setRead(false);
        request.setWrite(false);
        request.setGenerate(false);
        const reply = await Services.groupService.getGroups(request);

        const error = reply.getError()

        if (error) {
            Services.logger.error(error.getDescription());
        }
        
        return reply.getGroups()?.getGroupsList()?.map(x => x.toObject()) ?? [];
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