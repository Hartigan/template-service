import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProblemModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { GetProblemRequest } from '../../../protobuf/problems_pb';
import { GetHeadRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';

export interface IProblemSetEditorState {
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    addPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        headId: HeadId;
        problem: ProblemModel;
    };
    removePreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        headId: HeadId;
        problem: ProblemModel;
    };
};

async function getProblem(headId: HeadId) {
    const request = new GetHeadRequest();
    request.setHeadId(headId);
    const reply = await Services.versionService.getHead(request);
    const error = reply.getError();

    if (error) {
        Services.logger.error(error.getDescription());
        return null;
    }

    const commit = reply.getHead()?.getCommit()?.toObject();

    if (!commit) {
        return null;
    }

    const problemRequest = new GetProblemRequest();
    problemRequest.setCommitId(commit.id);
    const problemReply = await Services.problemsService.getProblem(problemRequest);

    const problemError = problemReply.getError();
    if (problemError) {
        Services.logger.error(problemError.getDescription());
    }

    const problem = problemReply.getProblem();
    if (problem) {
        return { headId: headId, problem: problem.toObject() };
    }
    return null;
}

export function createProblemSetEditorSlice(prefix: string) {
    const fetchAddPreview = createAsyncThunk(
        `problem_sets/editor/${prefix}-fetchAddPreview`,
        async (params: { headId: HeadId }) => {
            return await getProblem(params.headId);
        }
    );

    const fetchRemovePreview = createAsyncThunk(
        `problem_sets/editor/${prefix}-fetchRemovePreview`,
        async (params: { headId: HeadId }) => {
            return await getProblem(params.headId);
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
                    if (action.payload) {
                        state.addPreview = {
                            loading: 'succeeded',
                            ...action.payload,
                        }
                    }
                    else {
                        state.addPreview = {
                            loading: 'failed'
                        }
                    }
                    
                })
                .addCase(fetchAddPreview.pending, (state) => {
                    state.addPreview = {
                        loading: 'pending',
                    };
                })
                .addCase(fetchRemovePreview.fulfilled, (state, action) => {
                    if (action.payload) {
                        state.removePreview = {
                            loading: 'succeeded',
                            ...action.payload,
                        }
                    }
                    else {
                        state.removePreview = {
                            loading: 'failed'
                        }
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