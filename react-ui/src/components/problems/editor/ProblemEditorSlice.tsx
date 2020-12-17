import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Commit } from '../../../models/Commit';
import { Controller } from '../../../models/Controller';
import { HeadId } from '../../../models/Identificators';
import { Access } from '../../../models/Permissions';
import { Problem } from '../../../models/Problem';
import { Validator } from '../../../models/Validator';
import { View } from '../../../models/View';
import { permissionsService, problemsService, versionService } from '../../../Services';

export interface IProblemEditorState {
    description: string;
    disabled: boolean;
    data: {
        loading: 'idle' | 'pending';
    } | {
        loading: 'succeeded';
        commit: Commit;
        problem: Problem;
        access: Access;
    },
    updating: 'idle' | 'pending';
};

export const fetchProblem = createAsyncThunk(
    `problem/editor/fetchProblem`,
    async (params: { headId: HeadId; }) => {
        const head = await versionService.getHead(params.headId);
        const problem = await problemsService.get(head.commit.id);
        const access = await permissionsService.getAccess({ id: params.headId, type: "head" });
        return {
            commit: head.commit,
            problem: problem,
            access: access
        };
    }
);

export const saveProblem = createAsyncThunk(
    `problem/editor/saveProblem`,
    async (params: { headId: HeadId; description: string; problem: Problem; }) => {
        await problemsService.update(
            params.headId,
            params.description,
            params.problem
        );
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
        updateController: (state, action: PayloadAction<Controller>) => {
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
        updateView: (state, action: PayloadAction<View>) => {
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
        updateValidator: (state, action: PayloadAction<Validator>) => {
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
                state.data = {
                    ...action.payload,
                    loading: 'succeeded'
                };
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