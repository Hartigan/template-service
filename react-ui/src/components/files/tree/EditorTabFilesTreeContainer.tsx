import { connect } from 'react-redux'
import { FolderLink, HeadLink } from '../../../models/Folder';
import { editorTabFilesTreeSelector, IAppState } from '../../../store/Store';
import { setExpanded, selectFolder, selectHead, editorTabFetchRoot } from './EditorTabFilesTreeSlice';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';

const mapStateToProps = (state: IAppState) : IFileTreeParameters => {
    const localState = editorTabFilesTreeSelector(state);
    return {
        ...localState,
    };
};

const mapDispatchToProps = (dispatch) : IFilesTreeActions => {
    return {
        setExpanded: (expanded: Array<string>) => dispatch(setExpanded(expanded)),
        fetchRoot: () => dispatch(editorTabFetchRoot()),
        selectFolder: (folder: FolderLink) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLink) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);