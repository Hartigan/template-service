import { connect } from 'react-redux'
import { editorFilePreviewSelector, IAppState, problemSetPreviewSelector } from '../../../store/Store';
import { openEditProblemSetDialog } from '../dialogs/EditProblemSetDialogSlice';
import ProblemSetPreview, { IProblemSetPreviewActions, IProblemSetPreviewParameters } from './ProblemSetPreview';
import { fetchProblemPreview, fetchProblemSet, selectProblemInSlot, selectSlot } from './ProblemSetPreviewSlice';

const mapStateToProps = (state: IAppState) : IProblemSetPreviewParameters => {
    const localState = problemSetPreviewSelector(state);
    const preview = editorFilePreviewSelector(state);

    if (preview.data.loading !== 'succeeded') {
        return {
            ...localState,
            headId: null,
        }
    }

    return {
        ...localState,
        headId: preview.data.head.id,
    }
};

const mapDispatchToProps = (dispatch) : IProblemSetPreviewActions => {
    return {
        fetchProblemSetPreview: (headId) => dispatch(fetchProblemSet({ headId })),
        fetchProblemPreview: (headId) => dispatch(fetchProblemPreview({ headId })),
        selectSlot: (pos: number) => dispatch(selectSlot(pos)),
        selectProblemInSlot: (slot: number, problem: number) => dispatch(selectProblemInSlot({ slot: slot, problem: problem })),
        openEditDialog: (problemSet) => dispatch(openEditProblemSetDialog(problemSet)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSetPreview);