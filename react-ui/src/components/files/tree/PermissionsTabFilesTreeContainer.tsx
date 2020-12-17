import { connect } from 'react-redux'
import { FolderLink, HeadLink } from '../../../models/Folder';
import { permissionsTabFilesTreeSelector, IAppState } from '../../../store/Store';
import { setExpanded, selectFolder, selectHead, permissionsTabFetchRoot } from './PermissionsTabFilesTreeSlice';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';

const mapStateToProps = (state: IAppState) : IFileTreeParameters => {
    const localState = permissionsTabFilesTreeSelector(state);
    return {
        ...localState,
    };
};

const mapDispatchToProps = (dispatch) : IFilesTreeActions => {
    return {
        setExpanded: (expanded: Array<string>) => dispatch(setExpanded(expanded)),
        fetchRoot: () => dispatch(permissionsTabFetchRoot()),
        selectFolder: (folder: FolderLink) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLink) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);