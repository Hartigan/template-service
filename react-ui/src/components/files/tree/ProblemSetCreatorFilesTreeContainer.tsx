import { connect } from 'react-redux'
import { FolderLinkModel, HeadLinkModel } from '../../../models/domain';
import { TargetModel } from '../../../protobuf/domain_pb';
import { problemSetCreatorFilesTreeSelector, IAppState } from '../../../store/Store';
import FileTreeView, { IFilesTreeActions, IFileTreeParameters } from './FilesTreeView';
import { problemSetCreatorFetchRoot, selectFolder, selectHead, setExpanded } from './ProblemSetCreatorFilesTreeSlice';

const mapStateToProps = (state: IAppState) : IFileTreeParameters => {
    const localState = problemSetCreatorFilesTreeSelector(state);
    return {
        ...localState,
        filter: [TargetModel.ModelType.PROBLEM]
    };
};

const mapDispatchToProps = (dispatch) : IFilesTreeActions => {
    return {
        setExpanded: (expanded: Array<string>) => dispatch(setExpanded(expanded)),
        fetchRoot: () => dispatch(problemSetCreatorFetchRoot()),
        selectFolder: (folder: FolderLinkModel) => dispatch(selectFolder(folder)),
        selectHead: (head: HeadLinkModel) => dispatch(selectHead(head)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileTreeView);