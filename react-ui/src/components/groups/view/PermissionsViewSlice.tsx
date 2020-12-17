import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserId, GroupId } from '../../../models/Identificators';
import { permissionsService } from '../../../Services';
import { Protected } from '../../../services/PermissionsService';
import { Access, Permissions } from "../../../models/Permissions";

export interface IPermissionsViewState {
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        permissions: Permissions;
        protected: Protected;
    };
    newUserId: UserId | null;
    newGroupId: GroupId | null;
};

async function getPermissions(item: Protected) {
    const permissions = await permissionsService.getPermissions(item);
    return { permissions: permissions, protected: item };
}

export const fetchPersmissions = createAsyncThunk(
    `groups/view/fetchPermissions`,
    async (params: { item: Protected; }) => {
        return await getPermissions(params.item);
    }
);

export const addUser = createAsyncThunk(
    `groups/view/addUser`,
    async (params: { item: Protected; userId: UserId }) => {
        await permissionsService.addPermissionsMember(params.item, params.userId);
        return await getPermissions(params.item);
    }
);

export const removeUser = createAsyncThunk(
    `groups/view/removeUser`,
    async (params: { item: Protected; userId: UserId }) => {
        await permissionsService.removePermissionsMember(params.item, params.userId);
        return await getPermissions(params.item);
    }
);

export const updateUserAccess = createAsyncThunk(
    `groups/view/updateUserAccess`,
    async (params: { item: Protected; userId: UserId; access: Access; }) => {
        await permissionsService.updatePermissionsMember(params.item, params.userId, params.access);
        return await getPermissions(params.item);
    }
);

export const addGroup = createAsyncThunk(
    `groups/view/addGroup`,
    async (params: { item: Protected; groupId: GroupId }) => {
        await permissionsService.addPermissionsGroup(params.item, params.groupId);
        return await getPermissions(params.item);
    }
);

export const removeGroup = createAsyncThunk(
    `groups/view/removeGroup`,
    async (params: { item: Protected; groupId: GroupId }) => {
        await permissionsService.removePermissionsGroup(params.item, params.groupId);
        return await getPermissions(params.item);
    }
);

export const updateGroupAccess = createAsyncThunk(
    `groups/view/updateGroupAccess`,
    async (params: { item: Protected; groupId: GroupId; access: Access; }) => {
        await permissionsService.updatePermissionsGroup(params.item, params.groupId, params.access);
        return await getPermissions(params.item);
    }
);

export const setIsPublic = createAsyncThunk(
    `groups/view/setIsPublic`,
    async (params: { item: Protected; isPublic: boolean; }) => {
        await permissionsService.setIsPublic(params.item, params.isPublic);
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
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(updateUserAccess.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(removeGroup.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(updateGroupAccess.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(setIsPublic.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
            })
            .addCase(fetchPersmissions.fulfilled, (state, action) => {
                state.data = {
                    ...action.payload,
                    loading: "succeeded",
                };
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