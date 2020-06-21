import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import { FileExplorerState } from '../../states/FileExplorerState';
import { VersionService } from '../../services/VersionService';
import { UserId } from '../../models/Identificators';
import TagsEditorView from '../utils/TagsEditorView';
import { Head } from '../../models/Head';
import UserSearchView from '../common/UserSearchView';
import { UserService } from '../../services/UserService';
import SearchField from '../common/SearchField';
import HeadsListView from './HeadsListView';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    },
    search: {
        margin: "auto",
        padding: "10px"
    },
    searchItem: {
        margin: "auto",
        width: "300px"
    },
    titleSearch: {
        margin: "20px 0px 0px 0px",
        width: "100%"
    },
}));

interface IState {
    tags: Array<string>;
    pattern: string;
    ownerId: UserId | null;
    heads: Array<Head> | null;
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
        heads: null
    });

    React.useEffect(() => {
        let canUpdate = true;

        if (state.heads === null) {
            props.versionService
                .search(state.ownerId, state.tags, state.pattern, 0, 10)
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

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Box className={classes.search}>
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
            </Box>
            <HeadsListView
                heads={state.heads ? state.heads : []}
                state={props.state}
                />
        </Box>
    );
}