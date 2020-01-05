import * as React from 'react'
import { makeStyles, Box, Container, Button } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { FoldersService } from '../../services/FoldersService';
import FolderView from './FolderView';
import { FileExplorerState } from '../../states/FileExplorerState';
import CreateFolderDialog from './CreateFolderDialog';
import CreateProblemDialog from '../problems/CreateProblemDialog';
import { ProblemsService } from '../../services/ProblemsService';
import ExplorerView from './ExplorerView';
import { VersionService } from '../../services/VersionService';

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
    versionService: VersionService;
    state: FileExplorerState;
}

export default function FileTreeView(props: IFileTreeViewProps) {

    const [ openCreateFolderDialog, setOpenCreateFolderDialog ] = React.useState(false);
    const [ openCreateProblemDialog, setOpenCreateProblemDialog ] = React.useState(false);

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container>
                <Button onClick={() => setOpenCreateFolderDialog(true)}>New folder</Button>
                <Button onClick={() => setOpenCreateProblemDialog(true)}>New problem</Button>
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
            <ExplorerView
                versionService={props.versionService}
                foldersService={props.foldersService}
                state={props.state} />
        </Box>
    );
}