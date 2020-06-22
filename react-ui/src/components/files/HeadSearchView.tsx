import * as React from 'react'
import { makeStyles, Box, Container } from '@material-ui/core';
import { FileExplorerState } from '../../states/FileExplorerState';
import { VersionService } from '../../services/VersionService';
import { UserId } from '../../models/Identificators';
import TagsEditorView from '../utils/TagsEditorView';
import { Head } from '../../models/Head';
import UserSearchView from '../common/UserSearchView';
import { UserService } from '../../services/UserService';
import SearchField from '../common/SearchField';
import HeadsListView from './HeadsListView';
import { SearchNavigationView } from '../common/SearchNavigationView';

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

interface IState {
    tags: Array<string>;
    pattern: string;
    ownerId: UserId | null;
    heads: Array<Head> | null;
    page: number;
    limit: number;
}

export interface IHeadSearchViewProps {
    userService: UserService;
    versionService: VersionService;
    state: FileExplorerState;
}

export default function HeadSearchView(props: IHeadSearchViewProps) {

    const [ state, setState ] = React.useState<IState>({
        tags: [],
        pattern: "",
        ownerId: null,
        heads: null,
        page: 1,
        limit: 10
    });

    React.useEffect(() => {
        let canUpdate = true;

        if (state.heads === null) {
            props.versionService
                .search(
                    state.ownerId,
                    state.tags,
                    state.pattern,
                    (state.page - 1) * state.limit,
                    state.limit
                )
                .then(heads => {
                    if (canUpdate) {
                        setState({
                            ...state,
                            heads: heads
                        })
                    }
                })
        }

        return () => {
            canUpdate = false;
        };
    });

    const onAddSearchTag = (tag: string) => {
        if (tag) {
            setState({
                ...state,
                heads: null,
                tags: [...state.tags, tag]
            })
        }
    };

    const onRemoveSearchTag = (tag: string) => {
        setState({
            ...state,
            heads: null,
            tags: state.tags.filter(x => x !== tag)
        })
    };

    const onUserSelected = (ownerId: UserId | null) => {
        setState({
            ...state,
            heads: null,
            ownerId: ownerId
        });
    };

    const onSearchUpdated = (value: string) => {
        setState({
            ...state,
            heads: null,
            pattern: value
        });
    };

    const onPageChanged = (page: number) => {
        setState({
            ...state,
            heads: null,
            page: page
        });
    };

    const onLimitChanged = (limit: number) => {
        setState({
            ...state,
            heads: null,
            limit: limit
        });
    };

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.search}>
                <div className={classes.searchItem}>
                    <TagsEditorView
                        tags={state.tags}
                        onAdd={onAddSearchTag}
                        onRemove={onRemoveSearchTag}
                        />
                </div>
                <div className={classes.searchItem}>
                    <UserSearchView
                        userService={props.userService}
                        onUserSelected={onUserSelected}
                        />
                </div>
                <div className={classes.searchItem}>
                    <SearchField
                        className={classes.titleSearch}
                        placeholder="search..."
                        color="primary"
                        onSearch={onSearchUpdated}
                        />
                </div>
                <SearchNavigationView
                    className={classes.searchNavigation}
                    page={state.page}
                    size={state.limit}
                    onPageChanged={onPageChanged}
                    onSizeChanged={onLimitChanged}
                    />
            </Container>
            <HeadsListView
                heads={state.heads ? state.heads : []}
                state={props.state}
                />
        </Box>
    );
}