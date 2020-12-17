import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Commit } from '../../../models/Commit';
import { HeadId } from '../../../models/Identificators';
import { Access } from '../../../models/Permissions';
import { Problem } from '../../../models/Problem';
import { ProblemSet } from '../../../models/ProblemSet';
import { permissionsService, problemSetService, problemsService, versionService } from '../../../Services';

export interface IProblemSetPreviewState {
    problemSetPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'successed';
        commit: Commit;
        access: Access;
        problemSet: ProblemSet;
    };
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    problemPreview:{
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'successed';
        headId: HeadId;
        problem: Problem;
    };
};

export const fetchProblemSet = createAsyncThunk(
    `problem_sets/preview/fetchProblemSet`,
    async (params: { headId: HeadId; }) => {
        const head = await versionService.getHead(params.headId);
        const problemSet = await problemSetService.get(head.commit.id);
        const access = await permissionsService.getAccess({ id: params.headId, type: "head" });
        return { commit: head.commit, access: access, problemSet: problemSet };
    }
);

export const fetchProblemPreview = createAsyncThunk(
    `problem_sets/preview/fetchProblemPreview`,
    async (params: { headId: HeadId; }) => {
        const head = await versionService.getHead(params.headId);
        const problem = await problemsService.get(head.commit.id);
        return { headId: params.headId, problem: problem };
    }
);

const slice = createSlice({
    name: 'problem-set-preview',
    initialState: {
        problemSetPreview: {
            loading: 'idle',
        },
        selectedSlot: null,
        selectedProblemInSlot: null,
        problemPreview:{
            loading: 'idle',
        },
    } as IProblemSetPreviewState,
    reducers: {
        selectSlot: (state, action: PayloadAction<number>) => {
            state.selectedSlot = action.payload;
            state.selectedProblemInSlot = null;
        },
        selectProblemInSlot: (state, action: PayloadAction<{ slot: number; problem: number; }>) => {
            state.selectedSlot = action.payload.slot;
            state.selectedProblemInSlot = action.payload.problem;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProblemSet.fulfilled, (state, action) => {
                state.problemSetPreview = {
                    loading: "successed",
                    ...action.payload,
                };
                state.problemPreview = {
                    loading: 'idle',
                };
                state.selectedProblemInSlot = null;
                state.selectedSlot = null;
            })
            .addCase(fetchProblemSet.pending, (state) => {
                state.problemSetPreview = {
                    loading: 'pending',
                };
            })
            .addCase(fetchProblemPreview.fulfilled, (state, action) => {
                state.problemPreview = {
                    loading: "successed",
                    ...action.payload,
                };
            })
            .addCase(fetchProblemPreview.pending, (state) => {
                state.problemPreview = {
                    loading: 'pending',
                };
            });
    }
});

export const {
    selectSlot,
    selectProblemInSlot,
} = slice.actions;

export const problemSetPreviewReducer = slice.reducer;