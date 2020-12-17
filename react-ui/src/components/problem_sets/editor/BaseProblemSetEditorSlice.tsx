import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HeadId } from '../../../models/Identificators';
import { Problem } from '../../../models/Problem';
import { problemsService, versionService } from '../../../Services';

export interface IProblemSetEditorState {
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    addPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        headId: HeadId;
        problem: Problem;
    };
    removePreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        headId: HeadId;
        problem: Problem;
    };
};

export function createProblemSetEditorSlice(prefix: string) {
    const fetchAddPreview = createAsyncThunk(
            `problem_sets/editor/${prefix}-fetchAddPreview`,
            async (params: { headId: HeadId }) => {
                const head = await versionService.getHead(params.headId);
                const problem = await problemsService.get(head.commit.id);
                return { headId: params.headId, problem: problem };
            }
    );

    const fetchRemovePreview = createAsyncThunk(
        `problem_sets/editor/${prefix}-fetchRemovePreview`,
        async (params: { headId: HeadId }) => {
            const head = await versionService.getHead(params.headId);
            const problem = await problemsService.get(head.commit.id);
            return { headId: params.headId, problem: problem };
        }
    );

    const slice = createSlice({
        name: `${prefix}-problem-set-editor`,
        initialState: {
            selectedSlot: null,
            selectedProblemInSlot: null,
            addPreview: {
                loading: 'idle',
            },
            removePreview: {
                loading: 'idle',
            },
        } as IProblemSetEditorState,
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
                .addCase(fetchAddPreview.fulfilled, (state, action) => {
                    state.addPreview = {
                        loading: 'succeeded',
                        ...action.payload,
                    }
                })
                .addCase(fetchAddPreview.pending, (state) => {
                    state.addPreview = {
                        loading: 'pending',
                    };
                })
                .addCase(fetchRemovePreview.fulfilled, (state, action) => {
                    state.removePreview = {
                        loading: 'succeeded',
                        ...action.payload,
                    }
                })
                .addCase(fetchRemovePreview.pending, (state) => {
                    state.removePreview = {
                        loading: 'pending',
                    };
                });
        }
    });

    return { fetchAddPreview, fetchRemovePreview, slice };
};