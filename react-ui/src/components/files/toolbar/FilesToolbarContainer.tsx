import { connect } from 'react-redux'
import { filesToolbarSelector, IAppState } from '../../../store/Store';
import { IFilesToolbarState } from './FilesToolbarSlice';
import FilesToolbarView from './FilesToolbarView';

const mapStateToProps = (state: IAppState) : IFilesToolbarState => {
    const localState = filesToolbarSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilesToolbarView);