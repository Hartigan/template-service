import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeneratedProblem } from '../../../models/GeneratedProblem';
import { CommitId } from '../../../models/Identificators';
import { problemsService } from '../../../Services';

export interface ITestProblemDialogState {
    open: boolean;
    seed: number;
    data: {
        loading: 'idle' | 'pending'
    } | {
        loading: 'succeeded',
        seed: number,
        problem: GeneratedProblem;
    },
    answer: string;
    isCorrect: boolean | null;
};

export const generateProblem = createAsyncThunk(
    `problem/dialog/generateProblem`,
    async (params: { seed: number; commitId: CommitId; }) => {
        const problem = await problemsService.test(params.commitId, params.seed);
        return {
            seed: params.seed,
            problem: problem,
        };
    }
);

export const validateProblem = createAsyncThunk(
    `problem/dialog/validateProblem`,
    async (params: { commitId: CommitId; expected: string; actual: string; }) => {
        const result = await problemsService.validate(params.commitId, params.expected, params.actual);
        return result;
    }
);

const slice = createSlice({
    name: 'test-problem-dialog',
    initialState: {
        open: false,
        seed: 0,
        data: {
            loading: 'idle',
        },
        answer: "",
        isCorrect: null,
    } as ITestProblemDialogState,
    reducers: {
        openTestProblemDialog: (state) => {
            state.open = true;
            state.data = {
                loading: 'idle',
            };
            state.answer = "";
            state.isCorrect = null;
        },
        closeTestProblemDialog: (state) => {
            state.open = false;
        },
        updateSeed: (state, action: PayloadAction<number>) => {
            state.seed = action.payload;
        },
        updateAnswer: (state, action: PayloadAction<string>) => {
            state.answer = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(generateProblem.fulfilled, (state, action) => {
                state.data = {
                    loading: 'succeeded',
                    ...action.payload,
                };
                state.isCorrect = null;
            })
            .addCase(generateProblem.pending, (state) => {
                state.data = {
                    loading: 'pending',
                };
            })
            .addCase(validateProblem.fulfilled, (state, action) => {
                state.isCorrect = action.payload;
            })
            .addCase(validateProblem.pending, (state) => {
                state.isCorrect = null;
            });
    }
});

export const {
    openTestProblemDialog,
    closeTestProblemDialog,
    updateSeed,
    updateAnswer,
} = slice.actions;

export const testProblemDialogReducer = slice.reducer;