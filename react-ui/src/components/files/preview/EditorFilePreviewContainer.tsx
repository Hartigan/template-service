import { connect } from 'react-redux'
import { HeadId } from '../../../models/Identificators';
import { editorTabFilesTreeSelector, editorTabHeadSearchSelector, editorTabSelector, editorFilePreviewSelector, IAppState } from '../../../store/Store';
import { EditorTabTabs } from '../../tabs/editor/EditorTabSlice';
import EditorFilePreview, { IEditorFilePreviewActions, IEditorFilePreviewParameters } from './EditorFilePreview';
import { fetchHead, updateTags } from './EditorFilePreviewSlice';

const mapStateToProps = (state: IAppState) : IEditorFilePreviewParameters => {
    const localState = editorFilePreviewSelector(state);
    const tabState = editorTabSelector(state);
    const headSearchState = editorTabHeadSearchSelector(state);
    const treeState = editorTabFilesTreeSelector(state);

    switch (tabState.selected) {
        case EditorTabTabs.FileTree:
            return {
                ...localState,
                current: treeState.selectedHead,
            };
        case EditorTabTabs.HeadSearch:
            return {
                ...localState,
                current: headSearchState.selected,
            }
    }
};

const mapDispatchToProps = (dispatch) : IEditorFilePreviewActions  => {
    return {
        fetchHead: (headId: HeadId) => dispatch(fetchHead({ headId: headId })),
        updateTags: (headId: HeadId, tags: Array<string>) => dispatch(updateTags({ headId: headId, tags: tags })),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorFilePreview);