import { connect } from 'react-redux'
import { GroupId, UserId } from '../../../models/Identificators';
import { Access } from '../../../models/Permissions';
import { Protected } from '../../../services/PermissionsService';
import { IAppState, permissionsReportsSelector, permissionsTabFilesTreeSelector, permissionsTabHeadSearchSelector, permissionsTabSelector, permissionsViewSelector } from '../../../store/Store';
import { PermissionsTabTabs } from '../../tabs/permissions/PermissionsTabSlice';
import PermissionsView, { IPermissionsViewActions, IPermissionsViewParameters, ProtectedItem } from './PermissionsView';
import { addGroup, addUser, fetchPersmissions, removeGroup, removeUser, setIsPublic, setNewGroup, setNewUser, updateGroupAccess, updateUserAccess } from './PermissionsViewSlice';

const mapStateToProps = (state: IAppState) : IPermissionsViewParameters => {
    const localState = permissionsViewSelector(state);
    const tabState = permissionsTabSelector(state);
    const tree = permissionsTabFilesTreeSelector(state);
    const headSearch = permissionsTabHeadSearchSelector(state);
    const reportSearch = permissionsReportsSelector(state);

    let protectedItem : ProtectedItem | null = null;
    let title = "";

    switch(tabState.selected) {
        case PermissionsTabTabs.FileTree:
            if (tree.selectedHead) {
                protectedItem = {
                    id: tree.selectedHead.id,
                    type: tree.selectedHead.type,
                };
                title = tree.selectedHead.name;
            }
            break;
        case PermissionsTabTabs.HeadSearch:
            if (headSearch.selected) {
                protectedItem = {
                    id: headSearch.selected.id,
                    type: headSearch.selected.type,
                };
                title = headSearch.selected.name;
            }
            break;
        case PermissionsTabTabs.ReportSearch:
            if (reportSearch.selected) {
                protectedItem = {
                    id: reportSearch.selected.id,
                    type: "report",
                };
                title = reportSearch.selected.problem_set.title;
            }
            break;
    }

    return {
        ...localState,
        title: title,
        protectedItem: protectedItem,
    };
};

const mapDispatchToProps = (dispatch) : IPermissionsViewActions => {
    return {
        fetchPermissions: (item: Protected) => dispatch(fetchPersmissions({ item })),
        setNewUser: (userId: UserId | null) => dispatch(setNewUser(userId)),
        setNewGroup: (groupId: GroupId | null) => dispatch(setNewGroup(groupId)),
        addMember: (item: Protected, userId: UserId) => dispatch(addUser({ item, userId })),
        removeMember: (item: Protected, userId: UserId) => dispatch(removeUser({ item, userId })),
        updateMemberAccess: (item: Protected, userId: UserId, access: Access) => dispatch(updateUserAccess({ item, userId, access })),
        addGroup: (item: Protected, groupId: GroupId) => dispatch(addGroup({ item, groupId })),
        removeGroup: (item: Protected, groupId: GroupId) => dispatch(removeGroup({ item, groupId })),
        updateGroupAccess: (item: Protected, groupId: GroupId, access: Access) => dispatch(updateGroupAccess({ item, groupId, access })),
        setIsPublic: (item: Protected, isPublic: boolean) => dispatch(setIsPublic({ item, isPublic })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsView);