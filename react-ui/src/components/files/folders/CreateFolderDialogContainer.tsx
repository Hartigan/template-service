import { connect } from 'react-redux'
import { createFolderDialogSelector, editorTabFilesTreeSelector, IAppState } from '../../../store/Store';
import { editorTabFetchRoot } from '../tree/EditorTabFilesTreeSlice';
import CreateFolderDialog, { ICreateFolderDialogActions, ICreateFolderDialogParameters } from './CreateFolderDialog';
import { closeCreateFolderDialog, createFolder, updateName } from './CreateFolderDialogSlice';

const mapStateToProps = (state: IAppState) : ICreateFolderDialogParameters => {
    const localState = createFolderDialogSelector(state); 
    const filesTree = editorTabFilesTreeSelector(state);
    return {
        ...localState,
        folderId: filesTree.selectedFolder?.id ?? null,
    };
};

const mapDispatchToProps = (dispatch): ICreateFolderDialogActions => {
    return {
        create: (folderId, name) => dispatch(createFolder({ folderId, name })),
        close: () => dispatch(closeCreateFolderDialog()),
        updateName: (name) => dispatch(updateName(name)),
        updateFolder: (fodlerId) => dispatch(editorTabFetchRoot()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFolderDialog);