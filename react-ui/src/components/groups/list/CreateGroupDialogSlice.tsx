import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { groupService } from '../../../Services';

export interface ICreateGroupDialogState {
    open: boolean;
    name: string;
    nameError: string | null;
    desc: string;
    descError: string | null;
    creating: 'idle' | 'pending' | 'succeeded';
};

export const createGroup = createAsyncThunk(
    `groups/list/createGroup`,
    async (params: { name: string; desc: string; }) => {
        await groupService.create(params.name, params.desc);
    }
);

const slice = createSlice({
    name: 'groups-list-view',
    initialState: {
        open: false,
        name: "",
        nameError: null,
        desc: "",
        descError: null,
    } as ICreateGroupDialogState,
    reducers: {
        updateName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
            state.nameError = action.payload === "" ? "Name is empty" : null;
        },
        updateDescription: (state, action: PayloadAction<string>) => {
            state.desc = action.payload;
            state.descError = action.payload === "" ? "Description is empty" : null;
        },
        openCreateGroupDialog: (state) => {
            state.open = true;
            state.creating = 'idle';
            state.desc = '';
            state.descError = null;
            state.name = '';
            state.nameError = null;
        },
        closeCreateGroupDialog: (state) => {
            state.open = false;
            state.creating = 'idle';
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createGroup.fulfilled, (state, action) => {
                state.creating = 'succeeded';
            })
            .addCase(createGroup.pending, (state) => {
                state.creating = 'pending';
            });
    }
});

export const {
    updateName,
    updateDescription,
    openCreateGroupDialog,
    closeCreateGroupDialog,
} = slice.actions;

export const createGroupDialogReducer = slice.reducer;