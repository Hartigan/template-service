import { connect } from 'react-redux'
import AuthContent, { IAuthContentProps } from '../../components/auth/AuthContent';
import { IAuthContentState } from '../../store/auth/AuthContentSlice';
import { authSelector } from '../../store/Store';

const mapStateToProps = (state: IAuthContentState) : IAuthContentProps => {
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