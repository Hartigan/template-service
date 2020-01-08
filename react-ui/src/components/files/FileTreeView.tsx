import * as React from 'react'
import { makeStyles, Box, Container, Button, IconButton } from '@material-ui/core';
import { FoldersService } from '../../services/FoldersService';
import { FileExplorerState } from '../../states/FileExplorerState';
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

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    }
}));

export interface IFileTreeViewProps {
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    versionService: VersionService;
    state: FileExplorerState;
}

export default function FileTreeView(props: IFileTreeViewProps) {

    const [ openCreateFolderDialog, setOpenCreateFolderDialog ] = React.useState(false);
    const [ openCreateProblemDialog, setOpenCreateProblemDialog ] = React.useState(false);
    const [ openCreateProblemSetDialog, setOpenCreateProblemSetDialog ] = React.useState(false);

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container>
                <IconButton
                    color="primary" aria-label="Create folder"
                    onClick={() => setOpenCreateFolderDialog(true)}>
                    <CreateNewFolderIcon />
                </IconButton>
                <IconButton
                    color="primary" aria-label="Create problem"
                    onClick={() => setOpenCreateProblemDialog(true)}>
                    <NoteIcon />
                </IconButton>
                <IconButton
                    color="primary" aria-label="Create problem set"
                    onClick={() => setOpenCreateProblemSetDialog(true)}>
                    <ListAltIcon />
                </IconButton>
            </Container>
            <CreateFolderDialog
                fileExplorerState={props.state}
                foldersService={props.foldersService}
                open={openCreateFolderDialog}
                onClose={() => setOpenCreateFolderDialog(false)} />
            <CreateProblemDialog
                fileExplorerState={props.state}
                foldersService={props.foldersService}
                problemsService={props.problemsService}
                open={openCreateProblemDialog}
                onClose={() => setOpenCreateProblemDialog(false)} />
            <CreateProblemSetDialog
                fileExplorerState={props.state}
                foldersService={props.foldersService}
                versionService={props.versionService}
                problemsService={props.problemsService}
                problemSetService={props.problemSetService}
                open={openCreateProblemSetDialog}
                onClose={() => setOpenCreateProblemSetDialog(false)} />
            <ExplorerView
                versionService={props.versionService}
                foldersService={props.foldersService}
                state={props.state} />
        </Box>
    );
}