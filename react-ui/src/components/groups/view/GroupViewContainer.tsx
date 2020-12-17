import { connect } from 'react-redux'
import { GroupId, UserId } from '../../../models/Identificators';
import { Access } from '../../../models/Permissions';
import { groupsListSelector, groupViewSelector, IAppState } from '../../../store/Store';
import GroupView, { IGroupViewActions, IGroupViewParameters } from './GroupView';
import { addUser, fetchGroup, removeUser, setNewUser, updateUserAccess } from './GroupViewSlice';

const mapStateToProps = (state: IAppState) : IGroupViewParameters => {

    const localState = groupViewSelector(state);
    const groupsList = groupsListSelector(state);

    return {
        ...localState,
        groupId: groupsList.selectedGroup,
    };
};

const mapDispatchToProps = (dispatch) : IGroupViewActions => {
    return {
        fetchGroup: (groupId: GroupId) => dispatch(fetchGroup({ groupId })),
        addUser: (groupId: GroupId, userId: UserId) => dispatch(addUser({ groupId, userId })),
        removeUser: (groupId: GroupId, userId: UserId) => dispatch(removeUser({ groupId, userId })),
        updateUserAccess: (groupId: GroupId, userId: UserId, access: Access) => dispatch(updateUserAccess({ groupId, userId, access })),
        setNewUser: (userId: UserId | null) => dispatch(setNewUser(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupView);