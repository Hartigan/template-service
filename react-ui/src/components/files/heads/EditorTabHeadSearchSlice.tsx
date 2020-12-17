import { createHeadSearchSlice } from "./BaseHeadSearchSlice";

const { fetchHeads, slice } = createHeadSearchSlice('editor-tab');

export const editorTabFetchHeads = fetchHeads;

export const {
    selectHead,
    setTags,
    setPattern,
    setOwnerId,
    setPage,
    setLimit,
} = slice.actions;

export const editorTabHeadSearchReducer = slice.reducer;