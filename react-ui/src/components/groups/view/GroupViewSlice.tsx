import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserId, GroupId } from '../../../models/Identificators';
import { Access, Group } from '../../../models/Permissions';
import { groupService } from '../../../Services';

export interface IGroupViewState {
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        group: Group;
    };
    newUserId: UserId | null;
};

export const fetchGroup = createAsyncThunk(
    `groups/view/fetchGroup`,
    async (params: { groupId: GroupId; }) => {
        return await groupService.get(params.groupId);
    }
);

export const addUser = createAsyncThunk(
    `groups/view/addGroupMember`,
    async (params: { groupId: GroupId; userId: UserId}) => {
        await groupService.addMember(params.groupId, params.userId);
        return await groupService.get(params.groupId);
    }
);

export const removeUser = createAsyncThunk(
    `groups/view/removeGroupMember`,
    async (params: { groupId: GroupId; userId: UserId}) => {
        await groupService.removeMember(params.groupId, params.userId);
        return await groupService.get(params.groupId);
    }
);

export const updateUserAccess = createAsyncThunk(
    `groups/view/updateGroupMemberAccess`,
    async (params: { groupId: GroupId; userId: UserId; access: Access; }) => {
        await groupService.updateMember(params.groupId, params.userId, params.access);
        return await groupService.get(params.groupId);
    }
);

const slice = createSlice({
    name: 'group-view',
    initialState: {
        data: {
            loading: 'idle',
        },
        newUserId: null,
    } as IGroupViewState,
    reducers: {
        setNewUser: (state, action: PayloadAction<UserId | null>) => {
            state.newUserId = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(addUser.fulfilled, (state, action) => {
                state.data = {
                    group: action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.data = {
                    group: action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(updateUserAccess.fulfilled, (state, action) => {
                state.data = {
                    group: action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(fetchGroup.fulfilled, (state, action) => {
                state.data = {
                    group: action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(fetchGroup.pending, (state) => {
                state.data = {
                    loading: "pending",
                };
            });
    }
});

export const {
    setNewUser,
} = slice.actions;

export const groupViewReducer = slice.reducer;