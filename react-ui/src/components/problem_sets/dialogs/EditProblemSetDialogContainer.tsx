import { connect } from 'react-redux'
import { ProblemSetModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
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
        headId: preview.problemSetPreview.commit.headId,
    };
};

const mapDispatchToProps = (dispatch) : IEditProblemSetDialogActions => {
    return {
        saveProblemSet: (headId: HeadId, problemSet: ProblemSetModel, desc: string) => dispatch(saveProblemSet({
            headId: headId,
            problemSet: problemSet,
            description: desc,
        })),
        cancel: () => dispatch(cancel()),
        updateProblemSet: (problemSet: ProblemSetModel) => dispatch(updateProblemSet(problemSet)),
        updateDescription: (desc: string) => dispatch(updateDescription(desc)),
        updateHead: (headId: HeadId) => dispatch(fetchProblemSet({ headId: headId })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProblemSetDialog);