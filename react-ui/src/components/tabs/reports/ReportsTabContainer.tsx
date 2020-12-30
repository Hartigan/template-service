import { connect } from 'react-redux';
import { IAppState, reportsTabSelector } from '../../../store/Store';
import ReportsTab, { IReportsTabProps } from './ReportsTab';

const mapStateToProps = (state: IAppState) : IReportsTabProps => {
    const localState = reportsTabSelector(state); 
    return {
        ...localState,
        search: {
            ...localState.search,
            date: localState.search.date === null ? null : {
                from: new Date(localState.search.date.from),
                to: new Date(localState.search.date.to),
            },
        }
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportsTab);