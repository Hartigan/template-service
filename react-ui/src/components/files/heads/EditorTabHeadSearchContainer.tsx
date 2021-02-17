import { connect } from 'react-redux'
import { HeadLinkModel } from '../../../models/domain';
import { UserId } from '../../../models/Identificators';
import { IAppState, editorTabHeadSearchSelector } from '../../../store/Store';
import { editorTabFetchHeads, selectHead, setLimit, setOwnerId, setPage, setPattern, setTags } from './EditorTabHeadSearchSlice';
import HeadSearchView, { IHeadSearchViewActions, IHeadSearchViewParameters } from './HeadSearchView';

const mapStateToProps = (state: IAppState) : IHeadSearchViewParameters => {
    const localState = editorTabHeadSearchSelector(state);
    return {
        ...localState,
    };
};

const mapDispatchToProps = (dispatch) : IHeadSearchViewActions => {
    return {
        selectHead: (head: HeadLinkModel) => dispatch(selectHead(head)),
        setTags: (tags: Array<string>) => dispatch(setTags(tags)),
        setPattern: (pattern: string) => dispatch(setPattern(pattern)),
        setOwnerId: (ownerId: UserId | null) => dispatch(setOwnerId(ownerId)),
        setPage: (page: number) => dispatch(setPage(page)),
        setLimit: (limit: number) => dispatch(setLimit(limit)),
        fetchHeads: (params: {
                        ownerId: UserId | null;
                        tags: Array<string>;
                        pattern: string | null;
                        offset: number;
                        limit: number;
                    }) => dispatch(editorTabFetchHeads(params)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeadSearchView);