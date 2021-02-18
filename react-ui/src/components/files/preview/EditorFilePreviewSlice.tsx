import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HeadModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { UpdateTagsRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';
import { getHead } from '../../utils/Utils';

export interface IEditorFilePreviewState {
    data: {
        head: HeadModel;
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
        return await getHead(Services.versionService, params.headId);
    }
);

export const updateTags = createAsyncThunk(
    `files/preview/updateTags`,
    async (params: {
        headId: HeadId;
        tags: Array<string>;
    }) => {
        const request = new UpdateTagsRequest();
        request.setHeadId(params.headId);
        request.setTagsList(params.tags);
        const updateReply = await Services.versionService.updateTags(request);

        const updateError = updateReply.getError();
        if (updateError) {
            Services.logger.error(updateError.getDescription());
        }

        return await getHead(Services.versionService, params.headId);
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
            .addCase(fetchHead.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        loading: 'succeeded',
                        head: action.payload,
                    };
                }
                else {
                    state.data = {
                        loading: 'failed'
                    };
                }
            })
            .addCase(fetchHead.pending, (state, action) => {
                state.data = {
                    loading: 'pending',
                };
            })
            .addCase(updateTags.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = {
                        loading: 'succeeded',
                        head: action.payload,
                    };
                }
                else {
                    state.data = {
                        loading: 'failed'
                    };
                }
            });
    }
});

export const editorFilePreviewReducer = slice.reducer;