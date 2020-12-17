import { createFileTreeSlice } from "./BaseFilesTreeSlice";

const { fetchRoot, slice } = createFileTreeSlice('editor-tab');

export const editorTabFetchRoot = fetchRoot;

export const {
    setExpanded,
    selectFolder,
    selectHead,
} = slice.actions;

export const editorTabFilesTreeReducer = slice.reducer;