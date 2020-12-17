import { connect } from 'react-redux'
import { createGroupDialogSelector, IAppState } from '../../../store/Store';
import CreateGroupDialog, { ICreateGroupDialogActions, ICreateGroupDialogParameters } from './CreateGroupDialog';
import { closeCreateGroupDialog, createGroup, updateDescription, updateName } from './CreateGroupDialogSlice';
import { fetchGroups } from './GroupsListViewSlice';

const mapStateToProps = (state: IAppState) : ICreateGroupDialogParameters => {
    const localState = createGroupDialogSelector(state);

    return {
        ...localState,
    };
};

const mapDispatchToProps = (dispatch) : ICreateGroupDialogActions => {
    return {
        updateName: (name: string) => dispatch(updateName(name)),
        updateDescription: (desc: string) => dispatch(updateDescription(desc)),
        refreshList: () => dispatch(fetchGroups()),
        close: () => dispatch(closeCreateGroupDialog()),
        createGroup: (name: string, desc: string) => dispatch(createGroup({ name, desc })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupDialog);