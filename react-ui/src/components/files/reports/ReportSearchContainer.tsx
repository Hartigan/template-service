import { connect } from 'react-redux'
import { IAppState, permissionsReportsSelector } from '../../../store/Store';
import { IReportSearchState } from './ReportSearchSlice';
import ReportsListView from './ReportsListView';

const mapStateToProps = (state: IAppState) : IReportSearchState => {
    const localState = permissionsReportsSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsListView);