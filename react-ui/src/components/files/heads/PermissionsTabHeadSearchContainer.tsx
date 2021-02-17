import { connect } from 'react-redux'
import { UserId } from '../../../models/Identificators';
import { IAppState, permissionsTabHeadSearchSelector } from '../../../store/Store';
import { permissionsTabFetchHeads, selectHead, setLimit, setOwnerId, setPage, setPattern, setTags } from './PermissionsTabHeadSearchSlice';
import HeadSearchView, { IHeadSearchViewActions, IHeadSearchViewParameters } from './HeadSearchView';
import { HeadLinkModel } from '../../../models/domain';

const mapStateToProps = (state: IAppState) : IHeadSearchViewParameters => {
    const localState = permissionsTabHeadSearchSelector(state);
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
                    }) => dispatch(permissionsTabFetchHeads(params)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeadSearchView);