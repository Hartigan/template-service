import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProblemSetModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../protobuf/domain_pb';
import { UpdateProblemSetRequest } from '../../../protobuf/problem_sets_pb';
import Services from '../../../Services';

export interface IEditProblemSetDialogState {
    open: boolean;
    commitDescription: string;
    problemSet: ProblemSetModel | null;
    saving: 'idle' | 'pending' | 'succeeded';
};

export const saveProblemSet = createAsyncThunk(
    `problem_sets/dialogs/saveProblemSet`,
    async (params: { headId: HeadId; problemSet: ProblemSetModel; description: string }) => {
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
        const request = new UpdateProblemSetRequest();
        request.setHeadId(params.headId);
        request.setDescription(params.description);
        request.setProblemSet(problemSet);
        const reply = await Services.problemSetService.updateProblemSet(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        return reply.getCommitId();
    }
);

const slice = createSlice({
    name: 'edit-problem-set-dialog',
    initialState: {
        open: false,
        commitDescription: "",
        problemSet: null,
        saving: 'idle',
    } as IEditProblemSetDialogState,
    reducers: {
        openEditProblemSetDialog: (state, action: PayloadAction<ProblemSetModel>) => {
            state.problemSet = action.payload;
            state.open = true;
            state.commitDescription = "";
            state.saving = 'idle';
        },
        cancel: (state) => {
            state.problemSet = null;
            state.open = false;
            state.saving = 'idle';
        },
        updateProblemSet: (state, action: PayloadAction<ProblemSetModel>) => {
            state.problemSet = action.payload;
        },
        updateDescription: (state, action: PayloadAction<string>) => {
            state.commitDescription = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(saveProblemSet.fulfilled, (state) => {
                state.problemSet = null;
                state.open = false;
                state.saving = 'succeeded';
            })
            .addCase(saveProblemSet.pending, (state) => {
                state.saving = 'pending';
            });
    }
});

export const {
    openEditProblemSetDialog,
    cancel,
    updateProblemSet,
    updateDescription,
} = slice.actions;

export const editProblemSetDialogReducer = slice.reducer;