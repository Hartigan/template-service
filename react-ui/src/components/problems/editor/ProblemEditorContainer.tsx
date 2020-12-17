import { connect } from 'react-redux'
import { editorFilePreviewSelector, IAppState, problemEditorSelector } from '../../../store/Store';
import { openTestProblemDialog } from '../dialog/TestProblemDialogSlice';
import ProblemEditor, { IProblemEditorActions, IProblemEditorParameters } from './ProblemEditor';
import { cancel, edit, fetchProblem, saveProblem, updateController, updateDescription, updateTitle, updateValidator, updateView } from './ProblemEditorSlice';

const mapStateToProps = (state: IAppState) : IProblemEditorParameters => {
    const localState = problemEditorSelector(state);
    const preview = editorFilePreviewSelector(state);

    const headId = preview.data.loading === 'succeeded' ? preview.data.head.id : null;

    return {
        ...localState,
        headId: headId,
    };
};

const mapDispatchToProps = (dispatch) : IProblemEditorActions => {
    return {
        fetchProblem: (headId) => dispatch(fetchProblem({ headId })),
        saveProblem: (headId, description, problem) => dispatch(saveProblem({ headId, description, problem })),
        updateTitle: (title) => dispatch(updateTitle(title)),
        updateController: (controller) => dispatch(updateController(controller)),
        updateView: (view) => dispatch(updateView(view)),
        updateValidator: (validator) => dispatch(updateValidator(validator)),
        edit: () => dispatch(edit()),
        cancel: () => dispatch(cancel()),
        updateDescription: (description) => dispatch(updateDescription(description)),
        openTest: () => dispatch(openTestProblemDialog()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemEditor);