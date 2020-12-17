import React from 'react';
import { connect } from 'react-redux'
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../models/ProblemSet';
import { IAppState, problemSetCreateDialogSelector, problemSetCreatorFilesTreeSelector, problemSetCreatorSelector } from '../../../store/Store';
import ProblemSetCreatorFilesTreeContainer from '../../files/tree/ProblemSetCreatorFilesTreeContainer';
import { updateProblemSet } from '../dialogs/CreateProblemSetDialogSlice';
import { creatorFetchAddPreview, creatorFetchRemovePreview, selectProblemInSlot, selectSlot } from './ProblemSetCreatorSlice';
import ProblemSetEditor, { IProblemSetEditorActions, IProblemSetEditorParameters } from './ProblemSetEditorView';

const mapStateToProps = (state: IAppState) : IProblemSetEditorParameters => {
    const localState = problemSetCreatorSelector(state);
    const dialog = problemSetCreateDialogSelector(state);
    const filesTree = problemSetCreatorFilesTreeSelector(state);

    const problemSet = dialog.data?.problemSet ?? {
        id: "",
        title: "",
        slots: [],
        duration: 0,
    };

    return {
        ...localState,
        problemSet: problemSet,
        selectedAddProblem: filesTree.selectedHead?.id ?? null,
        problemsTree: <ProblemSetCreatorFilesTreeContainer />,
    }
    
};

const mapDispatchToProps = (dispatch) : IProblemSetEditorActions => {
    return {
        onUpdate: (problemSet: ProblemSet) => dispatch(updateProblemSet(problemSet)),
        fetchAddPreview: (headId: HeadId) => dispatch(creatorFetchAddPreview({ headId: headId })),
        fetchRemovePreview: (headId: HeadId) => dispatch(creatorFetchRemovePreview({ headId: headId })),
        selectSlot: (pos: number) => dispatch(selectSlot(pos)),
        selectProblemInSlot: (pos: number, problem: number) => dispatch(selectProblemInSlot({ slot: pos, problem: problem })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSetEditor);