import { connect } from 'react-redux';
import { IAppState, permissionsTabSelector } from '../../../store/Store';
import PermissionsTab, { IPermissionsTabProps } from './PermissionsTab';

const mapStateToProps = (state: IAppState) : IPermissionsTabProps => {
    const localState = permissionsTabSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsTab);