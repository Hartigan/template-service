import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Head } from '../../../models/Head';
import { HeadId } from '../../../models/Identificators';
import { versionService } from '../../../Services';

export interface IEditorFilePreviewState {
    data: {
        head: Head;
        loading: 'succeeded';
    } | {
        loading: 'idle' | 'pending' | 'failed';
    }
};

export const fetchHead = createAsyncThunk(
    `files/preview/fetchHead`,
    async (params: {
        headId: HeadId;
    }) => {
        const result = await versionService.getHead(params.headId);
        return result;
    }
);

export const updateTags = createAsyncThunk(
    `files/preview/updateTags`,
    async (params: {
        headId: HeadId;
        tags: Array<string>;
    }) => {
        await versionService.updateTags(params.headId, params.tags);
        const result = await versionService.getHead(params.headId);
        return result;
    }
);

const slice = createSlice({
    name: 'editor-file-preview',
    initialState: {
        data: {
            loading: 'idle',
        },
    } as IEditorFilePreviewState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(fetchHead.fulfilled, (state, action: PayloadAction<Head>) => {
                state.data = {
                    loading: 'succeeded',
                    head: action.payload,
                }
            })
            .addCase(fetchHead.pending, (state, action) => {
                state.data = {
                    loading: 'pending',
                };
            })
            .addCase(updateTags.fulfilled, (state, action: PayloadAction<Head>) => {
                state.data = {
                    loading: 'succeeded',
                    head: action.payload,
                }
            });
    }
});

export const editorFilePreviewReducer = slice.reducer;