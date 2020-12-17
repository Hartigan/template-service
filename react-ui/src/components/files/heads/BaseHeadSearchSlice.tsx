import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HeadLink } from '../../../models/Folder';
import { Head } from '../../../models/Head';
import { UserId } from '../../../models/Identificators';
import { versionService } from '../../../Services';

export interface IHeadSearchState {
    data: {
        loading: 'idle' | 'pending' | 'failed' | 'succeeded';
        heads: Array<Head>;
    };
    selected: HeadLink | null;
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
                const result = await versionService.search(
                    params.ownerId,
                    params.tags,
                    params.pattern,
                    params.offset,
                    params.limit,
                );
                return result;
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
            selectHead: (state, action: PayloadAction<HeadLink>) => {
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
                .addCase(fetchHeads.fulfilled, (state, action: PayloadAction<Array<Head>>) => {
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