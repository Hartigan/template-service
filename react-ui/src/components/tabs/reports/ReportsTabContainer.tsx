import { connect } from 'react-redux'
import { IAppState, reportsTabSelector } from '../../../store/Store';
import ReportsTab, { IReportsTabProps } from './ReportsTab';

const mapStateToProps = (state: IAppState) : IReportsTabProps => {
    const localState = reportsTabSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsTab);