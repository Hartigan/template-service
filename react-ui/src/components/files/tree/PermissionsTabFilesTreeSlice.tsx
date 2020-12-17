import { createFileTreeSlice } from "./BaseFilesTreeSlice";

const { fetchRoot, slice } = createFileTreeSlice('permissions-tab');

export const permissionsTabFetchRoot = fetchRoot;

export const {
    setExpanded,
    selectFolder,
    selectHead,
} = slice.actions;

export const permissionsTabFilesTreeReducer = slice.reducer;