import { createProblemSetEditorSlice } from "./BaseProblemSetEditorSlice";

const { initSlots, fetchRemovePreview, fetchAddPreview, slice } = createProblemSetEditorSlice('problem-set-editor');

export const editorFetchRemovePreview = fetchRemovePreview;
export const editorFetchAddPreview = fetchAddPreview;
export const editorInitSlots = initSlots;

export const {
    selectSlot,
    selectProblemInSlot,
    addSlot,
    addProblemIntoSlot,
    removeSlot,
    removeProblemFromSlot
} = slice.actions;

export const problemSetEditorReducer = slice.reducer;