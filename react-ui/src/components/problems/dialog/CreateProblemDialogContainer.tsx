import { connect } from 'react-redux'
import { editorTabFilesTreeSelector, IAppState, problemCreateDialogSelector } from '../../../store/Store';
import { editorTabFetchRoot } from '../../files/tree/EditorTabFilesTreeSlice';
import CreateProblemDialog, { ICreateProblemDialogActions, ICreateProblemDialogParameters } from './CreateProblemDialog';
import { closeCreateProblemDialog, createProblem, updateController, updateTitle, updateValidator, updateView } from './CreateProblemDialogSlice';

const mapStateToProps = (state: IAppState) : ICreateProblemDialogParameters => {
    const localState = problemCreateDialogSelector(state);
    const filesTree = editorTabFilesTreeSelector(state);

    return {
        ...localState,
        folderId: filesTree.selectedFolder?.id ?? null,
    };
};

const mapDispatchToProps = (dispatch) : ICreateProblemDialogActions => {
    return {
        create: (folderId, title, problem) => dispatch(createProblem({ folderId, title, problem })),
        close: () => dispatch(closeCreateProblemDialog()),
        updateFolder: (folderId) => dispatch(editorTabFetchRoot()),
        updateTitle: (title) => dispatch(updateTitle(title)),
        updateController: (controller) => dispatch(updateController(controller)),
        updateView: (view) => dispatch(updateView(view)),
        updateValidator: (validator) => dispatch(updateValidator(validator)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProblemDialog);