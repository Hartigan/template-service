import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccessModel, PermissionsModel, ProtectedItemModel } from '../../../models/domain';
import { UserId, GroupId } from '../../../models/Identificators';
import { AddMembersReply, AddMembersRequest, GetPermissionsRequest, RemoveMembersReply, RemoveMembersRequest, SetIsPublicRequest, UpdatePermissionsReply, UpdatePermissionsRequest } from '../../../protobuf/permissions_pb';
import Services from '../../../Services';
import { tryCreateAccess, tryCreateProtectedItem } from '../../utils/Utils';

export interface IPermissionsViewState {
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        permissions: PermissionsModel;
        protected: ProtectedItemModel;
    };
    newUserId: UserId | null;
    newGroupId: GroupId | null;
};

async function getPermissions(item: ProtectedItemModel) {
    const request = new GetPermissionsRequest();
    request.setItem(tryCreateProtectedItem(item));
    const reply = await Services.permissionsService.getPermissions(request);

    const error = reply.getError();
    if (error) {
        Services.logger.error(error.getDescription());
    }

    const permissions = reply.getPermissions();
    if (permissions) {
        return { permissions: permissions.toObject(), protected: item };
    }
    return null;
}

async function addMembers(item: ProtectedItemModel, users: Array<UserId>, groups: Array<GroupId>) {
    const request = new AddMembersRequest();
    request.setUsersList(users);
    request.setGroupsList(groups);
    request.setProtecteditem(tryCreateProtectedItem(item));
    const reply = await Services.permissionsService.addMembers(request);

    reply.getUsersList().forEach(entry => {
        if (entry.getStatus() !== AddMembersReply.Status.OK) {
            Services.logger.error(`User not added with status = ${entry.getStatus()}`)
        }
    });

    reply.getGroupsList().forEach(entry => {
        if (entry.getStatus() !== AddMembersReply.Status.OK) {
            Services.logger.error(`Group not added with status = ${entry.getStatus()}`)
        }
    });
}

async function removeMembers(item: ProtectedItemModel, users: Array<UserId>, groups: Array<GroupId>) {
    const request = new RemoveMembersRequest();
    request.setUsersList(users);
    request.setGroupsList(groups);
    request.setProtecteditem(tryCreateProtectedItem(item));
    const reply = await Services.permissionsService.removeMembers(request);

    reply.getUsersList().forEach(entry => {
        if (entry.getStatus() !== RemoveMembersReply.Status.OK) {
            Services.logger.error(`User not removed with status = ${entry.getStatus()}`)
        }
    });

    reply.getGroupsList().forEach(entry => {
        if (entry.getStatus() !== RemoveMembersReply.Status.OK) {
            Services.logger.error(`Group not removed with status = ${entry.getStatus()}`)
        }
    });
}

async function updateMembers(
    item: ProtectedItemModel,
    users: Array<UpdatePermissionsRequest.UserEntry.AsObject>,
    groups: Array<UpdatePermissionsRequest.GroupEntry.AsObject>) {
    const request = new UpdatePermissionsRequest();
    request.setUsersList(
        users
            .map(x => {
                const entry = new UpdatePermissionsRequest.UserEntry();
                entry.setUserId(x.userId);
                entry.setAccess(tryCreateAccess(x.access));
                return entry;
            })
    );
    request.setGroupsList(
        groups
            .map(x => {
                const entry = new UpdatePermissionsRequest.GroupEntry();
                entry.setGroupId(x.groupId);
                entry.setAccess(tryCreateAccess(x.access));
                return entry;
            })
    );
    request.setProtecteditem(tryCreateProtectedItem(item));
    const reply = await Services.permissionsService.updatePermissions(request);

    reply.getUsersList().forEach(entry => {
        if (entry.getStatus() !== UpdatePermissionsReply.Status.OK) {
            Services.logger.error(`User not removed with status = ${entry.getStatus()}`)
        }
    });

    reply.getGroupsList().forEach(entry => {
        if (entry.getStatus() !== UpdatePermissionsReply.Status.OK) {
            Services.logger.error(`Group not removed with status = ${entry.getStatus()}`)
        }
    });
}

export const fetchPersmissions = createAsyncThunk(
    `groups/view/fetchPermissions`,
    async (params: { item: ProtectedItemModel; }) => {
        return await getPermissions(params.item);
    }
);

export const addUser = createAsyncThunk(
    `groups/view/addUser`,
    async (params: { item: ProtectedItemModel; userId: UserId }) => {
        await addMembers(params.item, [ params.userId ], []);
        return await getPermissions(params.item);
    }
);

export const removeUser = createAsyncThunk(
    `groups/view/removeUser`,
    async (params: { item: ProtectedItemModel; userId: UserId }) => {
        await removeMembers(params.item, [ params.userId ], []);
        return await getPermissions(params.item);
    }
);

export const updateUserAccess = createAsyncThunk(
    `groups/view/updateUserAccess`,
    async (params: { item: ProtectedItemModel; userId: UserId; access: AccessModel; }) => {
        await updateMembers(params.item, [ { userId: params.userId, access: params.access } ], []);
        return await getPermissions(params.item);
    }
);

export const addGroup = createAsyncThunk(
    `groups/view/addGroup`,
    async (params: { item: ProtectedItemModel; groupId: GroupId }) => {
        await addMembers(params.item, [], [ params.groupId ]);
        return await getPermissions(params.item);
    }
);

export const removeGroup = createAsyncThunk(
    `groups/view/removeGroup`,
    async (params: { item: ProtectedItemModel; groupId: GroupId }) => {
        await removeMembers(params.item, [], [ params.groupId ]);
        return await getPermissions(params.item);
    }
);

export const updateGroupAccess = createAsyncThunk(
    `groups/view/updateGroupAccess`,
    async (params: { item: ProtectedItemModel; groupId: GroupId; access: AccessModel; }) => {
        await updateMembers(params.item, [], [ { groupId: params.groupId, access: params.access } ]);
        return await getPermissions(params.item);
    }
);

export const setIsPublic = createAsyncThunk(
    `groups/view/setIsPublic`,
    async (params: { item: ProtectedItemModel; isPublic: boolean; }) => {
        const request = new SetIsPublicRequest();
        request.setIsPublic(params.isPublic);
        request.setProtecteditem(tryCreateProtectedItem(params.item));
        const reply = await Services.permissionsService.setIsPublic(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return await getPermissions(params.item);
    }
);

const slice = createSlice({
    name: 'permissions-view',
    initialState: {
        data: {
            loading: 'idle',
        },
        newUserId: null,
        newGroupId: null,
    } as IPermissionsViewState,
    reducers: {
        setNewUser: (state, action: PayloadAction<UserId | null>) => {
            state.newUserId = action.payload;
        },
        setNewGroup: (state, action: PayloadAction<GroupId | null>) => {
            state.newGroupId = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(updateUserAccess.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(updateGroupAccess.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(setIsPublic.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(fetchPersmissions.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: "succeeded",
                    };
                }
                else {
                    state.data = {
                        loading: "idle"
                    }
                }
            })
            .addCase(fetchPersmissions.pending, (state) => {
                state.data = {
                    loading: 'pending'
                };
            });
    }
});

export const {
    setNewUser,
    setNewGroup,
} = slice.actions;

export const permissionsViewReducer = slice.reducer;