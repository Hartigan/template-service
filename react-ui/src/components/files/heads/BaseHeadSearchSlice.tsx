import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HeadLinkModel, HeadModel } from '../../../models/domain';
import { UserId } from '../../../models/Identificators';
import { SearchRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';
import { toStringValue } from '../../utils/Utils';

export interface IHeadSearchState {
    data: {
        loading: 'idle' | 'pending' | 'failed' | 'succeeded';
        heads: Array<HeadModel>;
    };
    selected: HeadLinkModel | null;
    search: {
        tags: Array<string>;
        pattern: string;
        ownerId: UserId | null;
        page: number;
        limit: number;
    }
};

export function createHeadSearchSlice(prefix: string) {
    const fetchHeads = createAsyncThunk(
            `files/heads/${prefix}-fetchHeads`,
            async (params: {
                ownerId: UserId | null;
                tags: Array<string>;
                pattern: string | null;
                offset: number;
                limit: number;
            }) => {
                const request = new SearchRequest();
                request.setOwnerId(toStringValue(params.ownerId));
                request.setTagsList(params.tags);
                request.setPattern(toStringValue(params.pattern));
                request.setOffset(params.offset);
                request.setLimit(params.limit);
                const reply = await Services.versionService.search(request);

                const error = reply.getError();
                if (error) {
                    Services.logger.error(error.getDescription());
                }

                return reply
                    .getHeads()
                    ?.getHeadsList()
                    ?.map(x => x.toObject()) ?? [];
            }
    );

    const slice = createSlice({
        name: `${prefix}-head-search`,
        initialState: {
            data: {
                loading: 'idle',
                heads: [],
            },
            selected: null,
            search: {
                tags: [],
                pattern: "",
                ownerId: null,
                page: 1,
                limit: 10
            }
        } as IHeadSearchState,
        reducers: {
            selectHead: (state, action: PayloadAction<HeadLinkModel>) => {
                state.selected = action.payload;
            },
            setTags: (state, action: PayloadAction<Array<string>>) => {
                state.search = {
                    ...state.search,
                    tags: action.payload
                };
                state.data = {
                    heads: [],
                    loading: 'idle'
                };
            },
            setPattern: (state, action: PayloadAction<string>) => {
                state.search = {
                    ...state.search,
                    pattern: action.payload
                };
                state.data = {
                    heads: [],
                    loading: 'idle'
                };
            },
            setOwnerId: (state, action: PayloadAction<UserId | null>) => {
                state.search = {
                    ...state.search,
                    ownerId: action.payload
                };
                state.data = {
                    heads: [],
                    loading: 'idle'
                };
            },
            setPage: (state, action: PayloadAction<number>) => {
                state.search = {
                    ...state.search,
                    page: action.payload
                };
                state.data = {
                    heads: [],
                    loading: 'idle'
                };
            },
            setLimit: (state, action: PayloadAction<number>) => {
                state.search = {
                    ...state.search,
                    limit: action.payload
                };
                state.data = {
                    heads: [],
                    loading: 'idle'
                };
            }
        },
        extraReducers: builder => {
            builder
                .addCase(fetchHeads.fulfilled, (state, action: PayloadAction<Array<HeadModel>>) => {
                    state.data = {
                        loading: 'succeeded',
                        heads: action.payload,
                    }
                })
                .addCase(fetchHeads.pending, (state, action) => {
                    state.data = {
                        loading: 'pending',
                        heads: []
                    };
                });
        }
    });

    return { fetchHeads, slice };
};