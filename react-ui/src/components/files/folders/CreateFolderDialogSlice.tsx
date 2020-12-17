import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FolderId } from '../../../models/Identificators';
import { foldersService } from '../../../Services';

export interface ICreateFolderDialogState {
    open: boolean;
    name: string;
    errorDescription: string;
    error: boolean;
    creating: 'idle' | 'pending' | 'succeeded';
};

export const createFolder = createAsyncThunk(
    `files/folders/createFolder`,
    async (params: { folderId: FolderId; name: string; }) => {
        await foldersService.createFolder(params.name, params.folderId);
    }
);

const slice = createSlice({
    name: 'create-folder-dialog',
    initialState: {
        open: false,
        name: "",
        errorDescription: "",
        error: false,
        creating: 'succeeded',
    } as ICreateFolderDialogState,
    reducers: {
        openCreateFolderDialog: (state) => {
            state.open = true;
            state.name = "";
            state.errorDescription = "";
            state.error = false;
            state.creating = 'idle';
        },
        closeCreateFolderDialog: (state) => {
            state.open = false;
            state.creating = 'idle';
        },
        updateName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
            state.error = action.payload.length === 0;
            state.errorDescription = action.payload.length === 0 ? "Name is empty" : "";
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createFolder.fulfilled, (state) => {
                state.creating = 'succeeded';
            })
            .addCase(createFolder.pending, (state) => {
                state.creating = 'pending';
            });
    }
});

export const {
    openCreateFolderDialog,
    closeCreateFolderDialog,
    updateName,
} = slice.actions;

export const createFolderDialogReducer = slice.reducer;