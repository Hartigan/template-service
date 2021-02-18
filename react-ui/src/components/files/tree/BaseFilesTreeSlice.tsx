import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FolderLinkModel, FolderModel, HeadLinkModel } from '../../../models/domain';
import { GetRootRequest } from '../../../protobuf/folders_pb';
import Services from '../../../Services';
import { getFolders } from '../../utils/Utils';
import { IFolderNode } from './FolderView';

export interface IFilesTreeState {
    data: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        root: IFolderNode;
    };
    expanded: Array<string>;
    selectedHead: HeadLinkModel | null;
    selectedFolder: FolderLinkModel | null;
};

export function createFileTreeSlice(prefix: string) {
    const fetchRoot = createAsyncThunk(
            `files/tree/${prefix}-fetchRoot`,
            async () => {
                async function getNode(folder: FolderModel) : Promise<IFolderNode> {
                    const foldersIds = folder.foldersList.map(f => f.id);
                    const folders = foldersIds.length === 0 ? [] : await getFolders(Services.foldersService, foldersIds);
                    const foldersNodes = await Promise.all(folders.map(f => getNode(f)));
                    return {
                        folder: {
                            id: folder.id,
                            name: folder.name,
                        },
                        children: {
                            folders: foldersNodes,
                            heads: folder.headsList,
                        },
                    };
                };

                const rootRequest = new GetRootRequest();
                const rootReply = await Services.foldersService.getRoot(rootRequest);

                const error = rootReply.getError();
                if (error) {
                    Services.logger.error(error.getDescription());
                }

                const root = rootReply.getFolder();

                if (root) {
                    return await getNode(root.toObject());
                }
                else {
                    return null;
                }
            }
    );

    const slice = createSlice({
        name: `${prefix}-files-tree`,
        initialState: {
            data: {
                loading: 'idle',
            },
            expanded: [],
            selectedHead: null,
            selectedFolder: null,
        } as IFilesTreeState,
        reducers: {
            setExpanded: (state, action: PayloadAction<Array<string>>) => {
                state.expanded = action.payload;
            },
            selectHead: (state, action: PayloadAction<HeadLinkModel>) => {
                state.selectedHead = action.payload;
            },
            selectFolder: (state, action: PayloadAction<FolderLinkModel>) => {
                state.selectedFolder = action.payload;
            }
        },
        extraReducers: builder => {
            builder
                .addCase(fetchRoot.fulfilled, (state, action) => {
                    if (action.payload) {
                        state.data = {
                            loading: 'succeeded',
                            root: action.payload,
                        };
                    }
                    else {
                        state.data = {
                            loading: 'failed'
                        };
                    }
                })
                .addCase(fetchRoot.pending, (state, action) => {
                    state.data = {
                        loading: 'pending',
                    };
                });
        }
    });

    return { fetchRoot, slice };
};