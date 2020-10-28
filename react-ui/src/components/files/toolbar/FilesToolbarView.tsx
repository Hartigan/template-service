import * as React from 'react'
import { makeStyles, Container, IconButton } from '@material-ui/core';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import NoteIcon from '@material-ui/icons/Note';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { useDispatch } from 'react-redux';
import { closeCreateFolderDialog, closeCreateProblemDialog, closeCreateProblemSetDialog, openCreateFolderDialog, openCreateProblemDialog, openCreateProblemSetDialog } from './FilesToolbarSlice';
import { FolderLink } from '../../../models/Folder';
import CreateProblemDialog from '../../problems/CreateProblemDialog';
import CreateProblemSetDialog from '../../problem_sets/CreateProblemSetDialog';
import CreateFolderDialog from '../CreateFolderDialog';

const useStyles = makeStyles(theme => ({
}));

export interface IFilesToolbarViewProps {
    createFolderDialog: {
        open: false;
    } | {
        open: true;
        targetFolder: FolderLink;
    };
    createProblemDialog: {
        open: false;
    } | {
        open: true;
        targetFolder: FolderLink;
    };
    createProblemSetDialog: {
        open: false;
    } | {
        open: true;
        targetFolder: FolderLink;
    };
    selectedFolder: FolderLink | null;
}

export default function FilesToolbarView(props: IFilesToolbarViewProps) {

    const dispatch = useDispatch();

    const classes = useStyles();

    return (
        <Container>
            <IconButton
                color="primary" aria-label="Create folder"
                disabled={props.selectedFolder === null}
                onClick={() => { if (props.selectedFolder !== null) dispatch(openCreateFolderDialog(props.selectedFolder)); } }>
                <CreateNewFolderIcon />
            </IconButton>
            <IconButton
                color="primary" aria-label="Create problem"
                disabled={props.selectedFolder === null}
                onClick={() => { if (props.selectedFolder !== null) dispatch(openCreateProblemDialog(props.selectedFolder)); } }>
                <NoteIcon />
            </IconButton>
            <IconButton
                color="primary" aria-label="Create problem set"
                disabled={props.selectedFolder === null}
                onClick={() => { if (props.selectedFolder !== null) dispatch(openCreateProblemSetDialog(props.selectedFolder)); } }>
                <ListAltIcon />
            </IconButton>
            {props.createFolderDialog.open
                ? <CreateFolderDialog
                    key="create_folder_dialog"
                    currentFolder={props.createFolderDialog.targetFolder}
                    open={props.createFolderDialog.open}
                    onClose={() => dispatch(closeCreateFolderDialog())} />
                : null}
            {props.createProblemDialog.open
                ? <CreateProblemDialog
                    key="create_problem_dialog"
                    currentFolder={props.createProblemDialog.targetFolder}
                    open={props.createProblemDialog.open}
                    onClose={() => dispatch(closeCreateProblemDialog())} />
                : null}
            {props.createProblemSetDialog.open
                ? <CreateProblemSetDialog
                    key="create_problem_set_dialog"
                    currentFolder={props.createProblemSetDialog.targetFolder}
                    open={props.createProblemSetDialog.open}
                    onClose={() => dispatch(closeCreateProblemSetDialog())} />
                : null}
        </Container>
    );
}