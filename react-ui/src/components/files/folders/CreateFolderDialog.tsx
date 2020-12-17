import { Dialog, DialogTitle, TextField, Container, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { FolderId } from "../../../models/Identificators";

export interface ICreateFolderDialogParameters {
    open: boolean;
    name: string;
    errorDescription: string;
    error: boolean;
    creating: 'idle' | 'pending' | 'succeeded';
    folderId: FolderId | null;
}

export interface ICreateFolderDialogActions {
    create(folderId: FolderId, name: string): void;
    close(): void;
    updateName(name: string): void;
    updateFolder(folderId: FolderId): void;
}

export interface ICreateFolderDialogProps extends ICreateFolderDialogActions, ICreateFolderDialogParameters {
}

export default function CreateFolderDialog(props: ICreateFolderDialogProps) {

    useEffect(() => {
        if (props.creating === 'succeeded' && props.folderId) {
            props.close();
            props.updateFolder(props.folderId);
        }
    });

    const onCreate = () => {
        if (props.error || props.folderId === null) {
            return;
        }
        props.create(props.folderId, props.name);
    }

    return (
        <Dialog
            aria-labelledby="dialog-title"
            open={props.open}>
            <DialogTitle id="dialog-title">Create folder</DialogTitle>
            <TextField
                label="Name"
                error={props.error}
                helperText={props.errorDescription}
                onChange={(e) => props.updateName(e.target.value)} />
            <Container>
                <Button variant="contained" onClick={() => onCreate()}>Create</Button>
                <Button variant="contained" onClick={props.close}>Cancel</Button>
            </Container>
        </Dialog>
    );
}
