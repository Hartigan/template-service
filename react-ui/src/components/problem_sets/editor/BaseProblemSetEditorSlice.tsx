import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HeadModel, ProblemModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../protobuf/domain_pb';
import { GetProblemRequest } from '../../../protobuf/problems_pb';
import { GetHeadsReply, GetHeadsRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';
import { getHead } from '../../utils/Utils';
import { ISlotData } from '../SlotsListView';

export interface IProblemSetEditorState {
    slots: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        data: Array<ISlotData>;
    };
    selectedSlot: number | null;
    selectedProblemInSlot: number | null;
    addPreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        head: HeadModel;
        problem: ProblemModel;
    };
    removePreview: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        head: HeadModel;
        problem: ProblemModel;
    };
};

async function getProblem(headId: HeadId) {
    const head = await getHead(Services.versionService, headId);

    if (!head) {
        return null;
    }

    const commit = head.commit;

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
        return { head: head, problem: problem.toObject() };
    }
    return null;
}

export function createProblemSetEditorSlice(prefix: string) {
    const initSlots = createAsyncThunk(
        `problem_sets/editor/${prefix}-initSlots`,
        async (params: { slotsList: Array<ProblemSet.Slot.AsObject>; }) => {
            const headIds = params.slotsList.flatMap(x => x.headIdsList);
            const request = new GetHeadsRequest();
            request.setHeadIdsList(headIds);
            const reply = await Services.versionService.getHeads(request);

            const fakeHead : HeadModel = {
                id: "",
                name: "No Head",
                tagsList: [],
            };
            const headsMap : Map<HeadId, HeadModel> = new Map<HeadId, HeadModel>();

            reply.getEntriesList()?.flatMap(x => {
                const entry = x.toObject()

                if (entry.status !== GetHeadsReply.Status.OK) {
                    Services.logger.error(`Head entry with id = ${entry.headId} returned with status = ${entry.status}`);
                }

                if (entry.head) {
                    return [ entry.head ];
                }
                else {
                    return [];
                }
            }).forEach(head => {
                headsMap[head.id] = head;
            });

            return params.slotsList.map(slot => {
                return {
                    heads: slot.headIdsList.map(headId => headsMap[headId] ?? fakeHead)
                } as ISlotData;
            });
        }
    );

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
            slots: {
                loading: 'idle',
            },
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
            },
            removeSlot: (state, action: PayloadAction<{ slot: number; }>) => {
                if (state.slots.loading !== "succeeded") {
                    return;
                }
                const slots = [...state.slots.data];
                slots.splice(action.payload.slot, 1);
                state.slots = {
                    loading: "succeeded",
                    data: slots
                };
            },
            removeProblemFromSlot: (state, action: PayloadAction<{ slot: number; problem: number; }>) => {
                if (state.slots.loading !== "succeeded") {
                    return;
                }
                const slots = [...state.slots.data];
                const slot = slots[action.payload.slot];
                if (!slot) {
                    return;
                }
                const heads = [...slot.heads];
                heads.splice(action.payload.problem, 1);
                slot.heads = heads;
                state.slots = {
                    loading: "succeeded",
                    data: slots
                };
            },
            addSlot: (state, action: PayloadAction<{ slot: number; }>) => {
                if (state.slots.loading !== "succeeded") {
                    return;
                }
                const slots = [...state.slots.data];
                slots.splice(action.payload.slot, 0, { heads: [] });
                state.slots = {
                    loading: "succeeded",
                    data: slots
                };
            },
            addProblemIntoSlot: (state, action: PayloadAction<{ slot: number; problem: number; head: HeadModel; }>) => {
                if (state.slots.loading !== "succeeded") {
                    return;
                }
                const slots = [...state.slots.data];
                const slot = slots[action.payload.slot];
                if (!slot) {
                    return;
                }
                const heads = [...slot.heads];
                heads.splice(action.payload.problem, 0, action.payload.head);
                slot.heads = heads;
                state.slots = {
                    loading: "succeeded",
                    data: slots
                };
            }
        },
        extraReducers: builder => {
            builder
                .addCase(initSlots.fulfilled, (state, action) => {
                    if (action.payload) {
                        state.slots = {
                            loading: 'succeeded',
                            data: action.payload,
                        }
                    }
                    else {
                        state.slots = {
                            loading: 'failed'
                        }
                    }
                    
                })
                .addCase(initSlots.pending, (state) => {
                    state.slots = {
                        loading: 'pending',
                    };
                })
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

    return { initSlots, fetchAddPreview, fetchRemovePreview, slice };
};