import React from 'react';
import { connect } from 'react-redux'
import { HeadModel, ProblemSetModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../protobuf/domain_pb';
import { IAppState, problemSetEditDialogSelector, problemSetEditorFilesTreeSelector, problemSetEditorSelector } from '../../../store/Store';
import ProblemSetEditorFilesTreeContainer from '../../files/tree/ProblemSetEditorFilesTreeContainer';
import { updateProblemSet } from '../dialogs/EditProblemSetDialogSlice';
import { addProblemIntoSlot, addSlot, editorFetchAddPreview, editorFetchRemovePreview, editorInitSlots, removeProblemFromSlot, removeSlot, selectProblemInSlot, selectSlot } from './ProblemSetEditorSlice';
import ProblemSetEditor, { IProblemSetEditorActions, IProblemSetEditorParameters } from './ProblemSetEditorView';

const mapStateToProps = (state: IAppState) : IProblemSetEditorParameters => {
    const localState = problemSetEditorSelector(state);
    const dialog = problemSetEditDialogSelector(state);
    const filesTree = problemSetEditorFilesTreeSelector(state);

    const problemSet = dialog.problemSet ?? {
        id: "",
        title: "",
        slotsList: [],
        durationS: 0,
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
        onUpdate: (problemSet: ProblemSetModel) => dispatch(updateProblemSet(problemSet)),
        initSlots: (slotsList: Array<ProblemSet.Slot.AsObject>) => dispatch(editorInitSlots({ slotsList: slotsList })),
        fetchAddPreview: (headId: HeadId) => dispatch(editorFetchAddPreview({ headId: headId })),
        fetchRemovePreview: (headId: HeadId) => dispatch(editorFetchRemovePreview({ headId: headId })),
        addSlot: (slotIndex: number) => dispatch(addSlot({ slot: slotIndex })),
        addProblemIntoSlot: (slotIndex: number, problemIndex: number, head: HeadModel) => dispatch(addProblemIntoSlot({ slot: slotIndex, problem: problemIndex, head: head })),
        removeSlot: (slotIndex: number) => dispatch(removeSlot({ slot: slotIndex })),
        removeProblemFromSlot: (slotIndex: number, problemIndex: number) => dispatch(removeProblemFromSlot({ slot: slotIndex, problem: problemIndex })),
        selectSlot: (pos: number) => dispatch(selectSlot(pos)),
        selectProblemInSlot: (pos: number, problem: number) => dispatch(selectProblemInSlot({ slot: pos, problem: problem })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSetEditor);