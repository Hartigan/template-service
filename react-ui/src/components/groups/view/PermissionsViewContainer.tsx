import { connect } from 'react-redux'
import { AccessModel, ProtectedItemModel } from '../../../models/domain';
import { GroupId, UserId } from '../../../models/Identificators';
import { ProtectedItem } from '../../../protobuf/domain_pb';
import { IAppState, permissionsReportsSelector, permissionsTabFilesTreeSelector, permissionsTabHeadSearchSelector, permissionsTabSelector, permissionsViewSelector } from '../../../store/Store';
import { PermissionsTabTabs } from '../../tabs/permissions/PermissionsTabSlice';
import PermissionsView, { IPermissionsViewActions, IPermissionsViewParameters } from './PermissionsView';
import { addGroup, addUser, fetchPersmissions, removeGroup, removeUser, setIsPublic, setNewGroup, setNewUser, updateGroupAccess, updateUserAccess } from './PermissionsViewSlice';

const mapStateToProps = (state: IAppState) : IPermissionsViewParameters => {
    const localState = permissionsViewSelector(state);
    const tabState = permissionsTabSelector(state);
    const tree = permissionsTabFilesTreeSelector(state);
    const headSearch = permissionsTabHeadSearchSelector(state);
    const reportSearch = permissionsReportsSelector(state);

    let protectedItem : ProtectedItemModel | null = null;
    let title = "";

    switch(tabState.selected) {
        case PermissionsTabTabs.FileTree:
            if (tree.selectedHead) {
                protectedItem = {
                    id: tree.selectedHead.id,
                    type: ProtectedItem.ProtectedType.HEAD,
                };
                title = tree.selectedHead.name;
            }
            break;
        case PermissionsTabTabs.HeadSearch:
            if (headSearch.selected) {
                protectedItem = {
                    id: headSearch.selected.id,
                    type: ProtectedItem.ProtectedType.HEAD,
                };
                title = headSearch.selected.name;
            }
            break;
        case PermissionsTabTabs.ReportSearch:
            if (reportSearch.selected) {
                protectedItem = {
                    id: reportSearch.selected.id,
                    type: ProtectedItem.ProtectedType.REPORT,
                };
                title = reportSearch.selected.problemSet?.title ?? "";
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
        fetchPermissions: (item: ProtectedItemModel) => dispatch(fetchPersmissions({ item })),
        setNewUser: (userId: UserId | null) => dispatch(setNewUser(userId)),
        setNewGroup: (groupId: GroupId | null) => dispatch(setNewGroup(groupId)),
        addMember: (item: ProtectedItemModel, userId: UserId) => dispatch(addUser({ item, userId })),
        removeMember: (item: ProtectedItemModel, userId: UserId) => dispatch(removeUser({ item, userId })),
        updateMemberAccess: (item: ProtectedItemModel, userId: UserId, access: AccessModel) => dispatch(updateUserAccess({ item, userId, access })),
        addGroup: (item: ProtectedItemModel, groupId: GroupId) => dispatch(addGroup({ item, groupId })),
        removeGroup: (item: ProtectedItemModel, groupId: GroupId) => dispatch(removeGroup({ item, groupId })),
        updateGroupAccess: (item: ProtectedItemModel, groupId: GroupId, access: AccessModel) => dispatch(updateGroupAccess({ item, groupId, access })),
        setIsPublic: (item: ProtectedItemModel, isPublic: boolean) => dispatch(setIsPublic({ item, isPublic })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsView);