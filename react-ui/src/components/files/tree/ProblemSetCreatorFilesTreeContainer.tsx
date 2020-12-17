import { connect } from 'react-redux'
import { FolderLink, HeadLink } from '../../../models/Folder';
import { problemSetCreatorFilesTreeSelector, IAppState } from '../../../store/Store';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';
import { problemSetCreatorFetchRoot, selectFolder, selectHead, setExpanded } from './ProblemSetCreatorFilesTreeSlice';

const mapStateToProps = (state: IAppState) : IFileTreeParameters => {
    const localState = problemSetCreatorFilesTreeSelector(state);
    return {
        ...localState,
        filter: ["problem"]
    };
};

const mapDispatchToProps = (dispatch) : IFilesTreeActions => {
    return {
        setExpanded: (expanded: Array<string>) => dispatch(setExpanded(expanded)),
        fetchRoot: () => dispatch(problemSetCreatorFetchRoot()),
        selectFolder: (folder: FolderLink) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLink) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);