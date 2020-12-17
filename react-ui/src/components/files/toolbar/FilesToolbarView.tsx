import * as React from 'react'
import { Container, IconButton } from '@material-ui/core';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import NoteIcon from '@material-ui/icons/Note';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CreateProblemSetDialogContainer from '../../problem_sets/dialogs/CreateProblemSetDialogContainer';
import CreateProblemDialogContainer from '../../problems/dialog/CreateProblemDialogContainer';
import CreateFolderDialogContainer from '../folders/CreateFolderDialogContainer';

export interface IFilesToolbarViewParameters {
    createFolderDialogActive: boolean;
    createProblemDialogActive: boolean;
    createProblemSetDialogActive: boolean;
}

export interface IFilesToolbarViewActions {
    openCreateFolderDialog(): void;
    openCreateProblemDialog(): void;
    openCreateProblemSetDialog(): void;
}

export interface IFilesToolbarViewProps extends IFilesToolbarViewActions, IFilesToolbarViewParameters {
}

export default function FilesToolbarView(props: IFilesToolbarViewProps) {

    return (
        <Container>
            <IconButton
                color="primary" aria-label="Create folder"
                disabled={!props.createFolderDialogActive}
                onClick={props.openCreateFolderDialog}>
                <CreateNewFolderIcon />
            </IconButton>
            <IconButton
                color="primary" aria-label="Create problem"
                disabled={!props.createProblemDialogActive}
                onClick={props.openCreateProblemDialog}>
                <NoteIcon />
            </IconButton>
            <IconButton
                color="primary" aria-label="Create problem set"
                disabled={!props.createProblemSetDialogActive}
                onClick={props.openCreateProblemSetDialog}>
                <ListAltIcon />
            </IconButton>
            <CreateFolderDialogContainer />
            <CreateProblemDialogContainer />
            <CreateProblemSetDialogContainer />
        </Container>
    );
}