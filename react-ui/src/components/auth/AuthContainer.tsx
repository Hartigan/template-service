import { connect } from 'react-redux'
import AuthContent, { IAuthContentProps } from './AuthContent';
import { authSelector, IAppState } from '../../store/Store';

const mapStateToProps = (state: IAppState) : IAuthContentProps => {
    const localState = authSelector(state); 
    return {
        name: localState.name,
        loading: localState.loading,
        error: localState.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContent);