import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeneratedProblemModel } from '../../../models/domain';
import { CommitId } from '../../../models/Identificators';
import { TestProblemRequest, ValidateRequest } from '../../../protobuf/problems_pb';
import Services from '../../../Services';

export interface ITestProblemDialogState {
    open: boolean;
    seed: number;
    data: {
        loading: 'idle' | 'pending'
    } | {
        loading: 'succeeded',
        seed: number,
        problem: GeneratedProblemModel;
    },
    answer: string;
    isCorrect: boolean | null;
};

export const generateProblem = createAsyncThunk(
    `problem/dialog/generateProblem`,
    async (params: { seed: number; commitId: CommitId; }) => {
        const request = new TestProblemRequest();
        request.setCommitId(params.commitId);
        request.setSeed(params.seed);
        const reply = await Services.problemsService.testProblem(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        const problem = reply.getProblem()?.toObject();
        if (problem) {
            return {
                seed: params.seed,
                problem: problem,
            };
        }

        return null;
    }
);

export const validateProblem = createAsyncThunk(
    `problem/dialog/validateProblem`,
    async (params: { commitId: CommitId; expected: string; actual: string; }) => {
        const request = new ValidateRequest();
        request.setCommitId(params.commitId);
        request.setActualAnswer(params.actual);
        request.setExpectedAnswer(params.expected);
        const reply = await Services.problemsService.validate(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return reply.getIsCorrect();
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
                if (action.payload) {
                    state.data = {
                        loading: 'succeeded',
                        ...action.payload,
                    };
                }
                else {
                    state.data = {
                        loading: 'idle'
                    };
                }
                
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