import React from 'react';
import { connect } from 'react-redux'
import { HeadModel, ProblemSetModel } from '../../../models/domain';
import { HeadId } from '../../../models/Identificators';
import { ProblemSet } from '../../../protobuf/domain_pb';
import { IAppState, problemSetCreateDialogSelector, problemSetCreatorFilesTreeSelector, problemSetCreatorSelector } from '../../../store/Store';
import ProblemSetCreatorFilesTreeContainer from '../../files/tree/ProblemSetCreatorFilesTreeContainer';
import { updateProblemSet } from '../dialogs/CreateProblemSetDialogSlice';
import { addProblemIntoSlot, addSlot, creatorFetchAddPreview, creatorFetchRemovePreview, creatorInitSlots, removeProblemFromSlot, removeSlot, selectProblemInSlot, selectSlot } from './ProblemSetCreatorSlice';
import ProblemSetEditor, { IProblemSetEditorActions, IProblemSetEditorParameters } from './ProblemSetEditorView';

const mapStateToProps = (state: IAppState) : IProblemSetEditorParameters => {
    const localState = problemSetCreatorSelector(state);
    const dialog = problemSetCreateDialogSelector(state);
    const filesTree = problemSetCreatorFilesTreeSelector(state);

    const problemSet = dialog.data?.problemSet ?? {
        id: "",
        title: "",
        slotsList: [],
        durationS: 0,
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
        onUpdate: (problemSet: ProblemSetModel) => dispatch(updateProblemSet(problemSet)),
        initSlots: (slotsList: Array<ProblemSet.Slot.AsObject>) => dispatch(creatorInitSlots({ slotsList: slotsList })),
        fetchAddPreview: (headId: HeadId) => dispatch(creatorFetchAddPreview({ headId: headId })),
        fetchRemovePreview: (headId: HeadId) => dispatch(creatorFetchRemovePreview({ headId: headId })),
        addSlot: (slotIndex: number) => dispatch(addSlot({ slot: slotIndex })),
        addProblemIntoSlot: (slotIndex: number, problemIndex: number, head: HeadModel) => dispatch(addProblemIntoSlot({ slot: slotIndex, problem: problemIndex, head: head })),
        removeSlot: (slotIndex: number) => dispatch(removeSlot({ slot: slotIndex })),
        removeProblemFromSlot: (slotIndex: number, problemIndex: number) => dispatch(removeProblemFromSlot({ slot: slotIndex, problem: problemIndex })),
        selectSlot: (pos: number) => dispatch(selectSlot(pos)),
        selectProblemInSlot: (pos: number, problem: number) => dispatch(selectProblemInSlot({ slot: pos, problem: problem })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSetEditor);