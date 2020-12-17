import { connect } from 'react-redux';
import { groupsTabSelector, IAppState } from '../../../store/Store';
import GroupsTab, { IGroupsTabActions, IGroupsTabParameters } from './GroupsTab';

const mapStateToProps = (state: IAppState) : IGroupsTabParameters => {
    const localState = groupsTabSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = (dispatch) : IGroupsTabActions => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsTab);