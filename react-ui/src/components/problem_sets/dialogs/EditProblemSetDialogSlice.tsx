import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../models/ProblemSet';
import { problemSetService } from '../../../Services';

export interface IEditProblemSetDialogState {
    open: boolean;
    commitDescription: string;
    problemSet: ProblemSet | null;
    saving: 'idle' | 'pending' | 'succeeded';
};

export const saveProblemSet = createAsyncThunk(
    `problem_sets/dialogs/saveProblemSet`,
    async (params: { headId: HeadId; problemSet: ProblemSet; description: string }) => {
        await problemSetService.update(params.headId, params.description, params.problemSet);
    }
);

const slice = createSlice({
    name: 'edit-problem-set-dialog',
    initialState: {
        open: false,
        commitDescription: "",
        problemSet: null,
        saving: 'idle',
    } as IEditProblemSetDialogState,
    reducers: {
        openEditProblemSetDialog: (state, action: PayloadAction<ProblemSet>) => {
            state.problemSet = action.payload;
            state.open = true;
            state.commitDescription = "";
            state.saving = 'idle';
        },
        cancel: (state) => {
            state.problemSet = null;
            state.open = false;
            state.saving = 'idle';
        },
        updateProblemSet: (state, action: PayloadAction<ProblemSet>) => {
            state.problemSet = action.payload;
        },
        updateDescription: (state, action: PayloadAction<string>) => {
            state.commitDescription = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(saveProblemSet.fulfilled, (state) => {
                state.problemSet = null;
                state.open = false;
                state.saving = 'succeeded';
            })
            .addCase(saveProblemSet.pending, (state) => {
                state.saving = 'pending';
            });
    }
});

export const {
    openEditProblemSetDialog,
    cancel,
    updateProblemSet,
    updateDescription,
} = slice.actions;

export const editProblemSetDialogReducer = slice.reducer;