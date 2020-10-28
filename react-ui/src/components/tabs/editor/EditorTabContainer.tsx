import { connect } from 'react-redux';
import { IAppState, editorTabSelector } from '../../../store/Store';
import EditorTab, { IEditorTabProps } from './EditorTab';

const mapStateToProps = (state: IAppState) : IEditorTabProps => {
    const localState = editorTabSelector(state); 
    return {
        ...localState
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorTab);