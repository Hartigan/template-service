import { connect } from 'react-redux'
import { IAppState, testProblemDialogSelector, problemEditorSelector } from '../../../store/Store';
import TestProblemDialog, { ITestProblemDialogParameters, ITestProblemDialogActions } from './TestProblemDialog';
import { closeTestProblemDialog, generateProblem, updateAnswer, updateSeed, validateProblem } from './TestProblemDialogSlice';

const mapStateToProps = (state: IAppState) : ITestProblemDialogParameters => {
    const localState = testProblemDialogSelector(state);
    const problemEditor = problemEditorSelector(state);

    const commitId = problemEditor.data.loading === 'succeeded' ? problemEditor.data.commit.id : null;

    return {
        ...localState,
        commitId: commitId,
    };
};

const mapDispatchToProps = (dispatch) : ITestProblemDialogActions => {
    return {
        generate: (seed, commitId) => dispatch(generateProblem({ seed, commitId })),
        validate: (commitId, expected, actual) => dispatch(validateProblem({ commitId, expected, actual })),
        close: () => dispatch(closeTestProblemDialog()),
        updateSeed: (seed) => dispatch(updateSeed(seed)),
        updateAnswer: (answer) => dispatch(updateAnswer(answer)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestProblemDialog);