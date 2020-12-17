import { createFileTreeSlice } from "./BaseFilesTreeSlice";

const { fetchRoot, slice } = createFileTreeSlice('problem-set-editor');

export const problemSetEditorFetchRoot = fetchRoot;

export const {
    setExpanded,
    selectFolder,
    selectHead,
} = slice.actions;

export const problemSetEditorFilesTreeReducer = slice.reducer;