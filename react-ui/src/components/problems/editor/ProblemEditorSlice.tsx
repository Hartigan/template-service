import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccessModel, CommitModel, ControllerModel, ProblemModel, ValidatorModel, ViewModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { Controller, Problem, ProtectedItem, Validator, View } from '../../../protobuf/domain_pb';
import { GetAccessInfoRequest } from '../../../protobuf/permissions_pb';
import { GetProblemRequest, UpdateProblemRequest } from '../../../protobuf/problems_pb';
import { GetHeadRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';
import { tryMap } from '../../utils/Utils';

export interface IProblemEditorState {
    description: string;
    disabled: boolean;
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        commit: CommitModel;
        problem: ProblemModel;
        access: AccessModel;
    },
    updating: 'idle' | 'pending';
};

export const fetchProblem = createAsyncThunk(
    `problem/editor/fetchProblem`,
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

        const protectedItem = new ProtectedItem();
        protectedItem.setId(params.headId);
        protectedItem.setType(ProtectedItem.ProtectedType.HEAD);

        const accessRequest = new GetAccessInfoRequest();
        accessRequest.setProtecteditemsList([ protectedItem ]);
        const accessReply = await Services.permissionsService.getAccessInfo(accessRequest);
        const access = accessReply.getAccessMap().get(params.headId)?.toObject();
        if (access) {
            return {
                commit: commit,
                problem: problem,
                access: access
            };
        }

        return null;
    }
);

export const saveProblem = createAsyncThunk(
    `problem/editor/saveProblem`,
    async (params: { headId: HeadId; description: string; problem: ProblemModel; }) => {
        const problem = new Problem();
        problem.setId(params.problem.id);
        problem.setTitle(params.problem.title);
        problem.setController(
            tryMap(params.problem.controller, x => {
                const result = new Controller()
                result.setLanguage(x.language);
                result.setContent(x.content);
                return result;
            })
        );
        problem.setView(
            tryMap(params.problem.view, x => {
                const result = new View()
                result.setLanguage(x.language);
                result.setContent(x.content);
                return result;
            })
        );
        problem.setValidator(
            tryMap(params.problem.validator, x => {
                const result = new Validator()
                result.setLanguage(x.language);
                result.setContent(x.content);
                return result;
            })
        );

        const request = new UpdateProblemRequest();
        request.setHeadId(params.headId);
        request.setDescription(params.description);
        request.setProblem(problem);
        const reply = await Services.problemsService.updateProblem(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return reply.getCommitId();
    }
);

const slice = createSlice({
    name: 'problem-editor',
    initialState: {
        description: "",
        disabled: true,
        data: {
            loading: 'idle',
        },
        updating: 'idle',
    } as IProblemEditorState,
    reducers: {
        updateTitle: (state, action: PayloadAction<string>) => {
            if (state.data.loading === 'succeeded') {
                state.data = {
                    ...state.data,
                    problem: {
                        ...state.data.problem,
                        title: action.payload,
                    }
                }
            }
        },
        updateController: (state, action: PayloadAction<ControllerModel>) => {
            if (state.data.loading === 'succeeded') {
                state.data = {
                    ...state.data,
                    problem: {
                        ...state.data.problem,
                        controller: action.payload,
                    }
                }
            }
        },
        updateView: (state, action: PayloadAction<ViewModel>) => {
            if (state.data.loading === 'succeeded') {
                state.data = {
                    ...state.data,
                    problem: {
                        ...state.data.problem,
                        view: action.payload,
                    }
                }
            }
        },
        updateValidator: (state, action: PayloadAction<ValidatorModel>) => {
            if (state.data.loading === 'succeeded') {
                state.data = {
                    ...state.data,
                    problem: {
                        ...state.data.problem,
                        validator: action.payload,
                    }
                }
            }
        },
        edit: (state) => {
            state.disabled = false;
            state.description = "";
        },
        cancel: (state) => {
            state.disabled = true;
            state.description = (state.data.loading === 'succeeded' ? state.data.commit.description : "");
        },
        updateDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProblem.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        ...action.payload,
                        loading: 'succeeded'
                    };
                }
                else {
                    state.data = {
                        loading: 'idle'
                    }
                }
                
            })
            .addCase(fetchProblem.pending, (state) => {
                state.data = {
                    loading: 'pending',
                };
            })
            .addCase(saveProblem.fulfilled, (state) => {
                state.data = {
                    loading: 'idle',
                };
                state.updating = 'idle';
                state.disabled = true;
            })
            .addCase(saveProblem.pending, (state) => {
                state.updating = 'pending';
                state.disabled = false;
            });
    }
});

export const {
    updateTitle,
    updateController,
    updateView,
    updateValidator,
    edit,
    cancel,
    updateDescription,
} = slice.actions;

export const problemEditorReducer = slice.reducer;