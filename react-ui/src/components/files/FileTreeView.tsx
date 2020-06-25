import * as React from 'react'
import { makeStyles, Container, IconButton, Toolbar, Tabs, Tab } from '@material-ui/core';
import { FoldersService } from '../../services/FoldersService';
import CreateFolderDialog from './CreateFolderDialog';
import CreateProblemDialog from '../problems/CreateProblemDialog';
import CreateProblemSetDialog from '../problem_sets/CreateProblemSetDialog';
import { ProblemsService } from '../../services/ProblemsService';
import ExplorerView from './ExplorerView';
import { VersionService } from '../../services/VersionService';
import { ProblemSetService } from '../../services/ProblemSetService';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import NoteIcon from '@material-ui/icons/Note';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { TabPanel } from '../common/TabPanel';
import HeadSearchView from './HeadSearchView';
import { UserService } from '../../services/UserService';
import { HeadLink, FolderLink } from '../../models/Folder';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    },
    tabs: {
        width: "100%"
    }
}));

interface IState {
    openCreateFolderDialog: boolean;
    openCreateProblemDialog: boolean;
    openCreateProblemSetDialog: boolean;
    selectedTab: number;
    selectedFolder: FolderLink | null;
    updatedFolder: FolderLink | null;
}

export interface IFileTreeViewProps {
    hideToolbar?: boolean;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    versionService: VersionService;
    userService: UserService;
    selected: HeadLink | null;
    onSelect: (head: HeadLink) => void;
}

export default function FileTreeView(props: IFileTreeViewProps) {

    const [ state, setState ] = React.useState<IState>({
        openCreateFolderDialog: false,
        openCreateProblemDialog: false,
        openCreateProblemSetDialog: false,
        selectedTab: 0,
        selectedFolder: null,
        updatedFolder: null
    });

    const onSelectFolder = (folder: FolderLink) => {
        setState({
            ...state,
            selectedFolder: folder
        });
    };

    const onFolderUpdated = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                setState({
                    ...state,
                    updatedFolder: null
                });
                resolve();
            });
        });
    };

    const setOpenCreateFolderDialog = (value: boolean) => {
        setState({
            ...state,
            openCreateFolderDialog: value,
            updatedFolder: !value ? state.selectedFolder : null
        });
    };

    const setOpenCreateProblemSetDialog = (value: boolean) => {
        setState({
            ...state,
            openCreateProblemSetDialog: value,
            updatedFolder: !value ? state.selectedFolder : null
        });
    };

    const setOpenCreateProblemDialog = (value: boolean) => {
        setState({
            ...state,
            openCreateProblemDialog: value,
            updatedFolder: !value ? state.selectedFolder : null
        });
    };

    const selectTab = (value: number) => {
        setState({
            ...state,
            selectedTab: value
        });
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Toolbar className={classes.tabs}>
                <Tabs
                    variant="fullWidth"
                    value={state.selectedTab}
                    onChange={(_, newValue) => selectTab(newValue)}>
                    <Tab label="Tree" />
                    <Tab label="Search" />
                </Tabs>
            </Toolbar>
            <TabPanel
                value={state.selectedTab}
                index={0}>
                <Container hidden={props.hideToolbar}>
                    <IconButton
                        color="primary" aria-label="Create folder"
                        disabled={state.selectedFolder === null}
                        onClick={() => setOpenCreateFolderDialog(true)}>
                        <CreateNewFolderIcon />
                    </IconButton>
                    <IconButton
                        color="primary" aria-label="Create problem"
                        disabled={state.selectedFolder === null}
                        onClick={() => setOpenCreateProblemDialog(true)}>
                        <NoteIcon />
                    </IconButton>
                    <IconButton
                        color="primary" aria-label="Create problem set"
                        disabled={state.selectedFolder === null}
                        onClick={() => setOpenCreateProblemSetDialog(true)}>
                        <ListAltIcon />
                    </IconButton>
                </Container>
                {state.selectedFolder ?
                    [
                        (<CreateFolderDialog
                            key="create_folder_dialog"
                            currentFolder={state.selectedFolder}
                            foldersService={props.foldersService}
                            open={state.openCreateFolderDialog}
                            onClose={() => setOpenCreateFolderDialog(false)} />),
                        (<CreateProblemDialog
                            key="create_problem_dialog"
                            currentFolder={state.selectedFolder}
                            foldersService={props.foldersService}
                            problemsService={props.problemsService}
                            open={state.openCreateProblemDialog}
                            onClose={() => setOpenCreateProblemDialog(false)} />),
                        (<CreateProblemSetDialog
                            key="create_problem_set_dialog"
                            currentFolder={state.selectedFolder}
                            foldersService={props.foldersService}
                            versionService={props.versionService}
                            problemsService={props.problemsService}
                            problemSetService={props.problemSetService}
                            open={state.openCreateProblemSetDialog}
                            onClose={() => setOpenCreateProblemSetDialog(false)} />)
                    ] : []
                }
                <ExplorerView
                    versionService={props.versionService}
                    foldersService={props.foldersService}
                    selectedFolder={state.selectedFolder}
                    onSelectFolder={onSelectFolder}
                    selectedHead={props.selected}
                    onSelectHead={props.onSelect}
                    onFolderUpdated={onFolderUpdated}
                    updatedFolder={state.updatedFolder}
                    />
            </TabPanel>
            <TabPanel
                value={state.selectedTab}
                index={1}>
                <HeadSearchView
                    userService={props.userService}
                    versionService={props.versionService}
                    selected={props.selected}
                    onSelect={props.onSelect}
                    />
            </TabPanel>

        </div>
    );
}