import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Folder, FolderLink, HeadLink } from '../../../models/Folder';
import { foldersService } from '../../../Services';
import { IFolderNode } from './FolderView';

export interface IFilesTreeState {
    data: {
        loading: 'idle' | 'pending' | 'failed';
    } | {
        loading: 'succeeded';
        root: IFolderNode;
    };
    expanded: Array<string>;
    selectedHead: HeadLink | null;
    selectedFolder: FolderLink | null;
};

export function createFileTreeSlice(prefix: string) {
    const fetchRoot = createAsyncThunk(
            `files/tree/${prefix}-fetchRoot`,
            async () => {
                async function getNode(folder: Folder) : Promise<IFolderNode> {
                    const folders = await Promise.all(folder.folders.map(f => foldersService.getFolder(f.id)));
                    const foldersNodes = await Promise.all(folders.map(f => getNode(f)));
                    return {
                        folder: {
                            id: folder.id,
                            name: folder.name,
                        },
                        children: {
                            folders: foldersNodes,
                            heads: folder.heads,
                        },
                    };
                };

                const rootFolder = await foldersService.getRoot();
                const result = await getNode(rootFolder);
                return result;
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
            selectHead: (state, action: PayloadAction<HeadLink>) => {
                state.selectedHead = action.payload;
            },
            selectFolder: (state, action: PayloadAction<FolderLink>) => {
                state.selectedFolder = action.payload;
            }
        },
        extraReducers: builder => {
            builder
                .addCase(fetchRoot.fulfilled, (state, action: PayloadAction<IFolderNode>) => {
                    state.data = {
                        loading: 'succeeded',
                        root: action.payload,
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