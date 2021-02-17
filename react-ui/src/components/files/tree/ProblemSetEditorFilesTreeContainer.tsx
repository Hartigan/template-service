import { connect } from 'react-redux'
import { IAppState, problemSetEditorFilesTreeSelector } from '../../../store/Store';
import { setExpanded, selectFolder, selectHead, problemSetEditorFetchRoot } from './ProblemSetEditorFilesTreeSlice';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';
import { FolderLinkModel, HeadLinkModel } from '../../../models/domain';
import { TargetModel } from '../../../protobuf/domain_pb';

const mapStateToProps = (state: IAppState) : IFileTreeParameters => {
    const localState = problemSetEditorFilesTreeSelector(state);
    return {
        ...localState,
        filter: [TargetModel.ModelType.PROBLEM]
    };
};

const mapDispatchToProps = (dispatch) : IFilesTreeActions => {
    return {
        setExpanded: (expanded: Array<string>) => dispatch(setExpanded(expanded)),
        fetchRoot: () => dispatch(problemSetEditorFetchRoot()),
        selectFolder: (folder: FolderLinkModel) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLinkModel) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);