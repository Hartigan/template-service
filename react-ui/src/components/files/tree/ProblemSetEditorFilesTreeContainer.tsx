import { connect } from 'react-redux'
import { FolderLink, HeadLink } from '../../../models/Folder';
import { IAppState, problemSetEditorFilesTreeSelector } from '../../../store/Store';
import { setExpanded, selectFolder, selectHead, problemSetEditorFetchRoot } from './ProblemSetEditorFilesTreeSlice';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';

const mapStateToProps = (state: IAppState) : IFileTreeParameters => {
    const localState = problemSetEditorFilesTreeSelector(state);
    return {
        ...localState,
        filter: ["problem"]
    };
};

const mapDispatchToProps = (dispatch) : IFilesTreeActions => {
    return {
        setExpanded: (expanded: Array<string>) => dispatch(setExpanded(expanded)),
        fetchRoot: () => dispatch(problemSetEditorFetchRoot()),
        selectFolder: (folder: FolderLink) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLink) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);