import { connect } from 'react-redux'
import { ProblemSetModel } from '../../../models/domain';
import { FolderId } from '../../../models/Identificators';
import { editorTabFilesTreeSelector, IAppState, problemSetCreateDialogSelector } from '../../../store/Store';
import { editorTabFetchRoot } from '../../files/tree/EditorTabFilesTreeSlice';
import CreateProblemSetDialog, { ICreateProblemSetDialogActions, ICreateProblemSetDialogParameters } from './CreateProblemSetDialog';
import { cancel, createProblemSet } from './CreateProblemSetDialogSlice';

const mapStateToProps = (state: IAppState) : ICreateProblemSetDialogParameters => {
    const localState = problemSetCreateDialogSelector(state);
    const filesTree = editorTabFilesTreeSelector(state);

    return {
        ...localState,
        folderId: filesTree.selectedFolder?.id ?? null,
    };
};

const mapDispatchToProps = (dispatch) : ICreateProblemSetDialogActions => {
    return {
        createProblemSet: (folderId: FolderId, title: string, problemSet: ProblemSetModel) => dispatch(createProblemSet({
            folderId: folderId,
            title: title,
            problemSet: problemSet,
        })),
        updateFolder: (folderId: FolderId) => dispatch(editorTabFetchRoot()),
        cancel: () => dispatch(cancel()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProblemSetDialog);