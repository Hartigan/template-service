import { createProblemSetEditorSlice } from "./BaseProblemSetEditorSlice";

const { fetchRemovePreview, fetchAddPreview, slice } = createProblemSetEditorSlice('problem-set-creator');

export const creatorFetchRemovePreview = fetchRemovePreview;
export const creatorFetchAddPreview = fetchAddPreview;

export const {
    selectSlot,
    selectProblemInSlot,
} = slice.actions;

export const problemSetCreatorReducer = slice.reducer;