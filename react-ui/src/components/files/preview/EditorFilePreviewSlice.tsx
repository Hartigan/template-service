import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { HeadModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { GetHeadRequest, UpdateTagsRequest } from '../../../protobuf/version_pb';
import Services from '../../../Services';

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
        const request = new GetHeadRequest();
        request.setHeadId(params.headId);
        const reply = await Services.versionService.getHead(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        return reply.getHead()?.toObject();
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

        const headRequest = new GetHeadRequest();
        headRequest.setHeadId(params.headId);
        const reply = await Services.versionService.getHead(headRequest);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }

        return reply.getHead()?.toObject();
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