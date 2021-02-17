import { connect } from 'react-redux'
import { permissionsTabFilesTreeSelector, IAppState } from '../../../store/Store';
import { setExpanded, selectFolder, selectHead, permissionsTabFetchRoot } from './PermissionsTabFilesTreeSlice';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';
import { FolderLinkModel, HeadLinkModel } from '../../../models/domain';

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
        selectFolder: (folder: FolderLinkModel) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLinkModel) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);