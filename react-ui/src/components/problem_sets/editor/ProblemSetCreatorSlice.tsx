import { createProblemSetEditorSlice } from "./BaseProblemSetEditorSlice";

const { initSlots, fetchRemovePreview, fetchAddPreview, slice } = createProblemSetEditorSlice('problem-set-creator');

export const creatorFetchRemovePreview = fetchRemovePreview;
export const creatorFetchAddPreview = fetchAddPreview;
export const creatorInitSlots = initSlots;

export const {
    selectSlot,
    selectProblemInSlot,
    addSlot,
    addProblemIntoSlot,
    removeSlot,
    removeProblemFromSlot
} = slice.actions;

export const problemSetCreatorReducer = slice.reducer;