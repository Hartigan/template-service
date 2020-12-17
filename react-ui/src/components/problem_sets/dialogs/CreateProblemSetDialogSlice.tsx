import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FolderId } from '../../../models/Identificators';
import { ProblemSet } from '../../../models/ProblemSet';
import { problemSetService } from '../../../Services';

export interface ICreateProblemSetDialogState {
    open: boolean;
    data: {
        problemSet: ProblemSet
    } | null;
    creating: 'idle' | 'pending' | 'succeeded';
};

export const createProblemSet = createAsyncThunk(
    `problem_sets/dialogs/createProblemSet`,
    async (params: { folderId: FolderId; title: string; problemSet: ProblemSet; }) => {
        await problemSetService.create(params.folderId, params.title, params.problemSet);
    }
);

const slice = createSlice({
    name: 'create-problem-set-dialog',
    initialState: {
        open: false,
        data: null,
        creating: 'idle',
    } as ICreateProblemSetDialogState,
    reducers: {
        openCreateProblemSetDialog: (state) => {
            state.data = {
                problemSet: {
                    title: "",
                    slots: [],
                    id: "",
                    duration: 0,
                }
            };
            state.open = true;
            state.creating = 'idle';
        },
        cancel: (state) => {
            state.data = null;
            state.open = false;
            state.creating = 'idle';
        },
        updateProblemSet: (state, action: PayloadAction<ProblemSet>) => {
            if (state.data) {
                state.data = {
                    ...state.data,
                    problemSet: action.payload,
                }
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(createProblemSet.fulfilled, (state) => {
                state.data = null;
                state.open = false;
                state.creating = 'succeeded';
            })
            .addCase(createProblemSet.pending, (state) => {
                state.creating = 'pending';
            });
    }
});

export const {
    openCreateProblemSetDialog,
    cancel,
    updateProblemSet,
} = slice.actions;

export const createProblemSetDialogReducer = slice.reducer;