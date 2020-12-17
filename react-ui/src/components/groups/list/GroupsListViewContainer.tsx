import { connect } from 'react-redux'
import { GroupId } from '../../../models/Identificators';
import { groupsListSelector, IAppState } from '../../../store/Store';
import { openCreateGroupDialog } from './CreateGroupDialogSlice';
import GroupsListView, { IGroupsListViewActions, IGroupsListViewParameters } from './GroupsListView';
import { fetchGroups, selectGroup } from './GroupsListViewSlice';

const mapStateToProps = (state: IAppState) : IGroupsListViewParameters => {
    const localState = groupsListSelector(state);

    return {
        ...localState,
    };
};

const mapDispatchToProps = (dispatch) : IGroupsListViewActions => {
    return {
        fetchGroups: () => dispatch(fetchGroups()),
        selectGroup: (groupId: GroupId | null) => dispatch(selectGroup(groupId)),
        openCreateGroupDialog: () => dispatch(openCreateGroupDialog()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsListView);