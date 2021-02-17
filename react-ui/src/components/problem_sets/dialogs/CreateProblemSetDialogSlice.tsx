import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProblemSetModel } from '../../../models/domain';
import { FolderId } from '../../../models/Identificators';
import { ProblemSet } from '../../../protobuf/domain_pb';
import { CreateProblemSetRequest } from '../../../protobuf/problem_sets_pb';
import Services from '../../../Services';

export interface ICreateProblemSetDialogState {
    open: boolean;
    data: {
        problemSet: ProblemSetModel
    } | null;
    creating: 'idle' | 'pending' | 'succeeded';
};

export const createProblemSet = createAsyncThunk(
    `problem_sets/dialogs/createProblemSet`,
    async (params: { folderId: FolderId; title: string; problemSet: ProblemSetModel; }) => {
        const problemSet = new ProblemSet();
        problemSet.setDurationS(params.problemSet.durationS);
        problemSet.setId(params.problemSet.id);
        problemSet.setTitle(params.problemSet.title);
        problemSet.setSlotsList(
            params.problemSet.slotsList.map(slot => {
                const result = new ProblemSet.Slot();
                result.setHeadIdsList(slot.headIdsList);
                return result;
            })
        );

        const request = new CreateProblemSetRequest();
        request.setFolderId(params.folderId);
        request.setName(params.title);
        request.setProblemSet(problemSet);
        const reply = await Services.problemSetService.createProblemSet(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return reply.getHeadId();
    }
);

const slice = createSlice({
    name: 'create-problem-set-dialog',
    initialState: {
        open: false,
        data: null,
        creating: 'idle',
    } as ICreateProblemSetDialogState,
    reducers: {
        openCreateProblemSetDialog: (state) => {
            state.data = {
                problemSet: {
                    title: "",
                    slotsList: [],
                    id: "",
                    durationS: 0,
                }
            };
            state.open = true;
            state.creating = 'idle';
        },
        cancel: (state) => {
            state.data = null;
            state.open = false;
            state.creating = 'idle';
        },
        updateProblemSet: (state, action: PayloadAction<ProblemSetModel>) => {
            if (state.data) {
                state.data = {
                    ...state.data,
                    problemSet: action.payload,
                }
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(createProblemSet.fulfilled, (state) => {
                state.data = null;
                state.open = false;
                state.creating = 'succeeded';
            })
            .addCase(createProblemSet.pending, (state) => {
                state.creating = 'pending';
            });
    }
});

export const {
    openCreateProblemSetDialog,
    cancel,
    updateProblemSet,
} = slice.actions;

export const createProblemSetDialogReducer = slice.reducer;