import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccessModel, CommitModel, ProblemModel, ProblemSetModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { ProtectedItem } from '../../../protobuf/domain_pb';
import { GetAccessInfoRequest } from '../../../protobuf/permissions_pb';
import { GetProblemRequest } from '../../../protobuf/problems_pb';
import { GetProblemSetRequest } from '../../../protobuf/problem_sets_pb';
import { GetHeadRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';

export interface IProblemSetPreviewState {
    problemSetPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'successed';
        commit: CommitModel;
        access: AccessModel;
        problemSet: ProblemSetModel;
    };
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    problemPreview:{
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'successed';
        headId: HeadId;
        problem: ProblemModel;
    };
};

export const fetchProblemSet = createAsyncThunk(
    `problem_sets/preview/fetchProblemSet`,
    async (params: { headId: HeadId; }) => {
        const headRequest = new GetHeadRequest();
        headRequest.setHeadId(params.headId);
        const headReply = await Services.versionService.getHead(headRequest);

        const headError = headReply.getError();
        if (headError) {
            Services.logger.error(headError.getDescription());
        }

        const commit = headReply.getHead()?.getCommit()?.toObject();
        if (!commit) {
            return null;
        }

        const problemSetRequest = new GetProblemSetRequest();
        problemSetRequest.setCommitId(commit.id);
        const problemSetReply = await Services.problemSetService.getProblemSet(problemSetRequest);

        const problemSetError = problemSetReply.getError();
        if (problemSetError) {
            Services.logger.error(problemSetError.getDescription());
        }

        const problemSet = problemSetReply.getProblemSet()?.toObject();
        if (!problemSet) {
            return null;
        }

        const protectedItem = new ProtectedItem();
        protectedItem.setId(params.headId);
        protectedItem.setType(ProtectedItem.ProtectedType.HEAD);

        const accessRequest = new GetAccessInfoRequest();
        accessRequest.setProtecteditemsList([ protectedItem ]);
        const accessReply = await Services.permissionsService.getAccessInfo(accessRequest);

        const access = accessReply.getAccessMap().get(params.headId)?.toObject();
        if (!access) {
            return null;
        }

        return { commit: commit, access: access, problemSet: problemSet };
    }
);

export const fetchProblemPreview = createAsyncThunk(
    `problem_sets/preview/fetchProblemPreview`,
    async (params: { headId: HeadId; }) => {
        const headRequest = new GetHeadRequest();
        headRequest.setHeadId(params.headId);
        const headReply = await Services.versionService.getHead(headRequest);

        const headError = headReply.getError();
        if (headError) {
            Services.logger.error(headError.getDescription());
        }

        const commit = headReply.getHead()?.getCommit()?.toObject();
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

        const problem = problemReply.getProblem()?.toObject();
        if (!problem) {
            return null;
        }
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
                if (action.payload) {
                    state.problemSetPreview = {
                        loading: "successed",
                        ...action.payload,
                    };
                }
                else {
                    state.problemSetPreview = {
                        loading: "failed"
                    };
                }
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
                if (action.payload) {
                    state.problemPreview = {
                        loading: "successed",
                        ...action.payload,
                    };
                }
                else {
                    state.problemPreview = {
                        loading: "failed"
                    }
                }
                
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