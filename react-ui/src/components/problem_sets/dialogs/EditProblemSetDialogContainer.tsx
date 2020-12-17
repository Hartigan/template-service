import { connect } from 'react-redux'
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../models/ProblemSet';
import { IAppState, problemSetEditDialogSelector, problemSetPreviewSelector } from '../../../store/Store';
import { fetchProblemSet } from '../preview/ProblemSetPreviewSlice';
import EditProblemSetDialog, { IEditProblemSetDialogActions, IEditProblemSetDialogParameters } from './EditProblemSetDialog';
import { cancel, saveProblemSet, updateDescription, updateProblemSet } from './EditProblemSetDialogSlice';

const mapStateToProps = (state: IAppState) : IEditProblemSetDialogParameters => {
    const localState = problemSetEditDialogSelector(state);
    const preview = problemSetPreviewSelector(state);

    if (preview.problemSetPreview.loading !== 'successed') {
        return {
            ...localState,
            headId: null,
        }
    }

    return {
        ...localState,
        headId: preview.problemSetPreview.commit.head_id,
    };
};

const mapDispatchToProps = (dispatch) : IEditProblemSetDialogActions => {
    return {
        saveProblemSet: (headId: HeadId, problemSet: ProblemSet, desc: string) => dispatch(saveProblemSet({
            headId: headId,
            problemSet: problemSet,
            description: desc,
        })),
        cancel: () => dispatch(cancel()),
        updateProblemSet: (problemSet: ProblemSet) => dispatch(updateProblemSet(problemSet)),
        updateDescription: (desc: string) => dispatch(updateDescription(desc)),
        updateHead: (headId: HeadId) => dispatch(fetchProblemSet({ headId: headId })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProblemSetDialog);