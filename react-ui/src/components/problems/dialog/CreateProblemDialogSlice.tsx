import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ControllerModel, ViewModel, ValidatorModel, ProblemModel } from '../../../models/domain';
import { FolderId } from '../../../models/Identificators';
import { Controller, View, Validator, Problem } from '../../../protobuf/domain_pb';
import { CreateProblemRequest } from '../../../protobuf/problems_pb';
import Services from '../../../Services';
import { tryMap } from '../../utils/Utils';

export interface ICreateProblemDialogState {
    open: boolean;
    title: string;
    controller: ControllerModel;
    view: ViewModel;
    validator: ValidatorModel;
    creating: 'idle' | 'pending' | 'succeeded';
};

export const createProblem = createAsyncThunk(
    `problem/dialog/createProblem`,
    async (params: { folderId: FolderId; title: string; problem: ProblemModel; }) => {
        const problem = new Problem();
        problem.setId(params.problem.id);
        problem.setTitle(params.problem.title);
        problem.setController(
            tryMap(params.problem.controller, x => {
                const result = new Controller();
                result.setContent(x.content);
                result.setLanguage(x.language);
                return result
            })
        );
        problem.setView(
            tryMap(params.problem.view, x => {
                const result = new View();
                result.setContent(x.content);
                result.setLanguage(x.language);
                return result
            })
        );
        problem.setValidator(
            tryMap(params.problem.validator, x => {
                const result = new Validator();
                result.setContent(x.content);
                result.setLanguage(x.language);
                return result
            })
        );
        const request = new CreateProblemRequest()
        request.setFolderId(params.folderId);
        request.setName(params.title);
        request.setProblem(problem);
        const reply = await Services.problemsService.createProblem(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return reply.getHeadId();
    }
);

const slice = createSlice({
    name: 'create-problem-dialog',
    initialState: {
        open: false,
        title: "",
        controller: {
            language: Controller.Language.C_SHARP,
            content: "",
        },
        view: {
            language: View.Language.PLAIN_TEXT,
            content: "",
        },
        validator: {
            language: Validator.Language.C_SHARP,
            content: "",
        },
        creating: 'idle',
    } as ICreateProblemDialogState,
    reducers: {
        openCreateProblemDialog: (state) => {
            state.open = true;
            state.title = "";
            state.controller = {
                language: Controller.Language.C_SHARP,
                content: "",
            };
            state.view = {
                language: View.Language.PLAIN_TEXT,
                content: "",
            };
            state.validator = {
                language: Validator.Language.C_SHARP,
                content: "",
            };
            state.creating = 'idle';
        },
        closeCreateProblemDialog: (state) => {
            state.open = false;
            state.creating = 'idle';
        },
        updateTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        updateController: (state, action: PayloadAction<ControllerModel>) => {
            state.controller = action.payload;
        },
        updateView: (state, action: PayloadAction<ViewModel>) => {
            state.view = action.payload;
        },
        updateValidator: (state, action: PayloadAction<ValidatorModel>) => {
            state.validator = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createProblem.fulfilled, (state) => {
                state.creating = 'succeeded';
            })
            .addCase(createProblem.pending, (state) => {
                state.creating = 'pending';
            });
    }
});

export const {
    openCreateProblemDialog,
    closeCreateProblemDialog,
    updateController,
    updateTitle,
    updateValidator,
    updateView
} = slice.actions;

export const createProblemDialogReducer = slice.reducer;