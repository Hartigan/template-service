import { createHeadSearchSlice } from "./BaseHeadSearchSlice";

const { fetchHeads, slice } = createHeadSearchSlice('permissions-tab');

export const permissionsTabFetchHeads = fetchHeads;

export const {
    selectHead,
    setTags,
    setPattern,
    setOwnerId,
    setPage,
    setLimit,
} = slice.actions;

export const permissionsTabHeadSearchReducer = slice.reducer;