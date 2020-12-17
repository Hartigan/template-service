import { createFileTreeSlice } from "./BaseFilesTreeSlice";

const { fetchRoot, slice } = createFileTreeSlice('problem-set-creator');

export const problemSetCreatorFetchRoot = fetchRoot;

export const {
    setExpanded,
    selectFolder,
    selectHead,
} = slice.actions;

export const problemSetCreatorFilesTreeReducer = slice.reducer;