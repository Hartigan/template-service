import { connect } from 'react-redux'
import { IAppState, trainTabSelector } from '../../../store/Store';
import TrainTab, { ITrainTabProps } from './TrainTab';

const mapStateToProps = (state: IAppState) : ITrainTabProps => {
    const localState = trainTabSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainTab);