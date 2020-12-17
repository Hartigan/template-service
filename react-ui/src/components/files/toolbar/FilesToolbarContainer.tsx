import { connect } from 'react-redux'
import { editorTabFilesTreeSelector, filesToolbarSelector, IAppState } from '../../../store/Store';
import { openCreateProblemDialog } from '../../problems/dialog/CreateProblemDialogSlice';
import { openCreateProblemSetDialog } from '../../problem_sets/dialogs/CreateProblemSetDialogSlice';
import { openCreateFolderDialog } from '../folders/CreateFolderDialogSlice';
import FilesToolbarView, { IFilesToolbarViewActions, IFilesToolbarViewParameters } from './FilesToolbarView';

const mapStateToProps = (state: IAppState) : IFilesToolbarViewParameters => {
    const localState = filesToolbarSelector(state); 
    const filesTree = editorTabFilesTreeSelector(state);
    return {
        ...localState,
        createFolderDialogActive: filesTree.selectedFolder !== null,
        createProblemDialogActive: filesTree.selectedFolder !== null,
        createProblemSetDialogActive: filesTree.selectedFolder !== null,
    };
};

const mapDispatchToProps = (dispatch) : IFilesToolbarViewActions => {
    return {
        openCreateFolderDialog: () => dispatch(openCreateFolderDialog()),
        openCreateProblemDialog: () => dispatch(openCreateProblemDialog()),
        openCreateProblemSetDialog: () => dispatch(openCreateProblemSetDialog()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesToolbarView);