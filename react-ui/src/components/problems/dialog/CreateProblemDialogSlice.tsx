import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ControllerLanguage, ValidatorLanguage, ViewLanguage } from '../../../models/Code';
import { Controller } from '../../../models/Controller';
import { FolderId } from '../../../models/Identificators';
import { Problem } from '../../../models/Problem';
import { Validator } from '../../../models/Validator';
import { View } from '../../../models/View';
import { problemsService } from '../../../Services';

export interface ICreateProblemDialogState {
    open: boolean;
    title: string;
    controller: Controller;
    view: View;
    validator: Validator;
    creating: 'idle' | 'pending' | 'succeeded';
};

export const createProblem = createAsyncThunk(
    `problem/dialog/createProblem`,
    async (params: { folderId: FolderId; title: string; problem: Problem; }) => {
        await problemsService.create(params.folderId, params.title, params.problem);
    }
);

const slice = createSlice({
    name: 'create-problem-dialog',
    initialState: {
        open: false,
        title: "",
        controller: {
            language: ControllerLanguage.CSharp,
            content: "",
        },
        view: {
            language: ViewLanguage.PlainText,
            content: "",
        },
        validator: {
            language: ValidatorLanguage.CSharp,
            content: "",
        },
        creating: 'idle',
    } as ICreateProblemDialogState,
    reducers: {
        openCreateProblemDialog: (state) => {
            state.open = true;
            state.title = "";
            state.controller = {
                language: ControllerLanguage.CSharp,
                content: "",
            };
            state.view = {
                language: ViewLanguage.PlainText,
                content: "",
            };
            state.validator = {
                language: ValidatorLanguage.CSharp,
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
        updateController: (state, action: PayloadAction<Controller>) => {
            state.controller = action.payload;
        },
        updateView: (state, action: PayloadAction<View>) => {
            state.view = action.payload;
        },
        updateValidator: (state, action: PayloadAction<Validator>) => {
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