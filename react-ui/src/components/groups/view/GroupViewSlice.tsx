import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccessModel, GroupModel } from '../../../models/domain';
import { UserId, GroupId } from '../../../models/Identificators';
import { AddMembersReply, AddMembersRequest, GetGroupRequest, RemoveMembersReply, RemoveMembersRequest, UpdateMemberRequest } from '../../../protobuf/groups_pb';
import Services from '../../../Services';
import { tryCreateAccess } from '../../utils/Utils';

export interface IGroupViewState {
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        group: GroupModel;
    };
    newUserId: UserId | null;
};

async function getGroup(params: { groupId: GroupId; }) {
    const request = new GetGroupRequest();
    request.setGroupId(params.groupId);
    const reply = await Services.groupService.getGroup(request);

    const error = reply.getError();
    if (error) {
        Services.logger.error(error.getDescription());
    }

    return reply.getGroup()?.toObject();
}

export const fetchGroup = createAsyncThunk(
    `groups/view/fetchGroup`,
    async (params: { groupId: GroupId; }) => {
        return await getGroup(params);
    }
);

export const addUser = createAsyncThunk(
    `groups/view/addGroupMember`,
    async (params: { groupId: GroupId; userId: UserId}) => {
        const request = new AddMembersRequest();
        request.addUsers(params.userId);
        request.setGroupId(params.groupId);
        const reply = await Services.groupService.addMembers(request);

        reply.getUsersList().forEach(entry => {
            if (entry.getStatus() !== AddMembersReply.Status.OK) {
                Services.logger.error(`failed with status ${entry.getStatus()}`)
            }
        });

        return await getGroup(params);
    }
);

export const removeUser = createAsyncThunk(
    `groups/view/removeGroupMember`,
    async (params: { groupId: GroupId; userId: UserId}) => {
        const request = new RemoveMembersRequest();
        request.addUsers(params.userId);
        request.setGroupId(params.groupId);
        const reply = await Services.groupService.removeMembers(request);

        reply.getUsersList().forEach(entry => {
            if (entry.getStatus() !== RemoveMembersReply.Status.OK) {
                Services.logger.error(`failed with status ${entry.getStatus()}`)
            }
        });
        return await getGroup(params);
    }
);

export const updateUserAccess = createAsyncThunk(
    `groups/view/updateGroupMemberAccess`,
    async (params: { groupId: GroupId; userId: UserId; access: AccessModel; }) => {
        const request = new UpdateMemberRequest();
        request.setAccess(tryCreateAccess(params.access));
        request.setUserId(params.userId);
        request.setGroupId(params.groupId);
        const reply = await Services.groupService.updateMember(request);

        const error = reply.getError();

        if (error) {
            Services.logger.error(error.getDescription());
        }

        return await getGroup(params);
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
                if (action.payload) {
                    state.data = {
                        group: action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    };
                }
                
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        group: action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    };
                }
            })
            .addCase(updateUserAccess.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        group: action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    };
                }
            })
            .addCase(fetchGroup.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        group: action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    };
                }
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