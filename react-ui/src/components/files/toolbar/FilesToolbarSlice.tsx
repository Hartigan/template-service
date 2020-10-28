import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FolderLink } from '../../../models/Folder';

export interface IFilesToolbarState {
    createFolderDialog: {
        open: false;
    } | {
        open: true;
        targetFolder: FolderLink;
    };
    createProblemDialog: {
        open: false;
    } | {
        open: true;
        targetFolder: FolderLink;
    };
    createProblemSetDialog: {
        open: false;
    } | {
        open: true;
        targetFolder: FolderLink;
    };
    selectedFolder: FolderLink | null;
};

const slice = createSlice({
    name: 'files-toolbar',
    initialState: {
        createFolderDialog: { open: false },
        createProblemDialog: { open: false },
        createProblemSetDialog: { open: false },
    } as IFilesToolbarState,
    reducers: {
        selectFolder: (state, action: PayloadAction<FolderLink | null>) => {
            state.selectedFolder = action.payload;
        },
        openCreateFolderDialog: (state, action: PayloadAction<FolderLink>) => {
            state.createFolderDialog = {
                open: true,
                targetFolder: action.payload,
            };
        },
        closeCreateFolderDialog: (state) => {
            state.createFolderDialog = {
                open: false,
            };
        },
        openCreateProblemDialog: (state, action: PayloadAction<FolderLink>) => {
            state.createProblemDialog = {
                open: true,
                targetFolder: action.payload,
            };
        },
        closeCreateProblemDialog: (state) => {
            state.createProblemDialog = {
                open: false,
            };
        },
        openCreateProblemSetDialog: (state, action: PayloadAction<FolderLink>) => {
            state.createProblemSetDialog = {
                open: true,
                targetFolder: action.payload,
            };
        },
        closeCreateProblemSetDialog: (state) => {
            state.createProblemSetDialog = {
                open: false,
            };
        }
    },
});

export const {
    selectFolder,
    openCreateFolderDialog,
    closeCreateFolderDialog,
    openCreateProblemDialog,
    closeCreateProblemDialog,
    openCreateProblemSetDialog,
    closeCreateProblemSetDialog,
} = slice.actions;

export const filesToolbarReducer = slice.reducer;