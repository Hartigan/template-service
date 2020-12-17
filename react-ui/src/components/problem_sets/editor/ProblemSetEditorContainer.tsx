import React from 'react';
import { connect } from 'react-redux'
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../models/ProblemSet';
import { IAppState, problemSetEditDialogSelector, problemSetEditorFilesTreeSelector, problemSetEditorSelector } from '../../../store/Store';
import ProblemSetEditorFilesTreeContainer from '../../files/tree/ProblemSetEditorFilesTreeContainer';
import { updateProblemSet } from '../dialogs/EditProblemSetDialogSlice';
import { editorFetchAddPreview, editorFetchRemovePreview, selectProblemInSlot, selectSlot } from './ProblemSetEditorSlice';
import ProblemSetEditor, { IProblemSetEditorActions, IProblemSetEditorParameters } from './ProblemSetEditorView';

const mapStateToProps = (state: IAppState) : IProblemSetEditorParameters => {
    const localState = problemSetEditorSelector(state);
    const dialog = problemSetEditDialogSelector(state);
    const filesTree = problemSetEditorFilesTreeSelector(state);

    const problemSet = dialog.problemSet ?? {
        id: "",
        title: "",
        slots: [],
        duration: 0,
    };

    return {
        ...localState,
        problemSet: problemSet,
        selectedAddProblem: filesTree.selectedHead?.id ?? null,
        problemsTree: <ProblemSetEditorFilesTreeContainer />,
    }
    
};

const mapDispatchToProps = (dispatch) : IProblemSetEditorActions => {
    return {
        onUpdate: (problemSet: ProblemSet) => dispatch(updateProblemSet(problemSet)),
        fetchAddPreview: (headId: HeadId) => dispatch(editorFetchAddPreview({ headId: headId })),
        fetchRemovePreview: (headId: HeadId) => dispatch(editorFetchRemovePreview({ headId: headId })),
        selectSlot: (pos: number) => dispatch(selectSlot(pos)),
        selectProblemInSlot: (pos: number, problem: number) => dispatch(selectProblemInSlot({ slot: pos, problem: problem })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSetEditor);