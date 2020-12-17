import { createProblemSetEditorSlice } from "./BaseProblemSetEditorSlice";

const { fetchRemovePreview, fetchAddPreview, slice } = createProblemSetEditorSlice('problem-set-editor');

export const editorFetchRemovePreview = fetchRemovePreview;
export const editorFetchAddPreview = fetchAddPreview;

export const {
    selectSlot,
    selectProblemInSlot,
} = slice.actions;

export const problemSetEditorReducer = slice.reducer;