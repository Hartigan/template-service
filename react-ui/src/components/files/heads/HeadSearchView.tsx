import * as React from 'react'
import { makeStyles, Box, Container } from '@material-ui/core';
import { UserId } from '../../../models/Identificators';
import SearchField from '../../common/SearchField';
import { SearchNavigationView } from '../../common/SearchNavigationView';
import UserSearchView from '../../common/UserSearchView';
import TagsEditorView from '../../utils/TagsEditorView';
import HeadsListView from './HeadsListView';
import { HeadLinkModel, HeadModel } from '../../../models/domain';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    },
    search: {
        padding: "10px",
        width: "100%"
    },
    searchItem: {
        margin: "auto",
        width: "300px"
    },
    titleSearch: {
        margin: "20px 0px 0px 0px",
        width: "100%"
    },
    searchNavigation: {
        margin: "auto",
        width: "100%",
        textAlign: "center"
    },
}));

export interface IHeadSearchViewActions {
    selectHead: (head: HeadLinkModel) => void;
    setTags: (tags: Array<string>) => void;
    setPattern: (pattern: string) => void;
    setOwnerId: (ownerId: UserId | null) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    fetchHeads: (params: {
                    ownerId: UserId | null;
                    tags: Array<string>;
                    pattern: string | null;
                    offset: number;
                    limit: number;
                }) => void;
};

export interface IHeadSearchViewParameters {
    data: {
        loading: 'idle' | 'pending' | 'failed' | 'succeeded';
        heads: Array<HeadModel>;
    };
    selected: HeadLinkModel | null;
    search: {
        tags: Array<string>;
        pattern: string;
        ownerId: UserId | null;
        page: number;
        limit: number;
    }
}

export interface IHeadSearchViewProps extends IHeadSearchViewActions, IHeadSearchViewParameters {
};

export default function HeadSearchView(props: IHeadSearchViewProps) {

    React.useEffect(() => {
        if (props.data.loading === 'idle') {
            props.fetchHeads({
                ownerId: props.search.ownerId,
                tags: props.search.tags,
                pattern: props.search.pattern,
                offset: (props.search.page - 1) * props.search.limit,
                limit: props.search.limit,
            });
        }
    });

    const onAddSearchTag = (tag: string) => {
        if (tag) {
            props.setTags([...props.search.tags, tag]);
        }
    };

    const onRemoveSearchTag = (tag: string) => {
        props.setTags(props.search.tags.filter(x => x !== tag));
    };

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.search}>
                <div className={classes.searchItem}>
                    <TagsEditorView
                        tags={props.search.tags}
                        onAdd={onAddSearchTag}
                        onRemove={onRemoveSearchTag}
                        />
                </div>
                <div className={classes.searchItem}>
                    <UserSearchView
                        onUserSelected={props.setOwnerId}
                        />
                </div>
                <div className={classes.searchItem}>
                    <SearchField
                        className={classes.titleSearch}
                        placeholder="search..."
                        color="primary"
                        onSearch={props.setPattern}
                        />
                </div>
                <SearchNavigationView
                    className={classes.searchNavigation}
                    page={props.search.page}
                    size={props.search.limit}
                    onPageChanged={props.setPage}
                    onSizeChanged={props.setLimit}
                    />
            </Container>
            <HeadsListView
                heads={props.data.heads}
                selected={props.selected}
                onSelect={props.selectHead}
                />
        </Box>
    );
}