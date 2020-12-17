import { Dialog, DialogTitle, TextField, Container, Button } from "@material-ui/core";
import React, { useEffect } from "react";

export interface ICreateGroupDialogParameters {
    open: boolean;
    name: string;
    nameError: string | null;
    desc: string;
    descError: string | null;
    creating: 'idle' | 'pending' | 'succeeded';
}

export interface ICreateGroupDialogActions {
    updateName(name: string): void;
    updateDescription(desc: string): void;
    refreshList(): void;
    close(): void;
    createGroup(name: string, desc: string): void;
}

export interface ICreateGroupDialogProps extends ICreateGroupDialogParameters, ICreateGroupDialogActions {
}

export default function CreateGroupDialog(props: ICreateGroupDialogProps) {

    useEffect(() => {
        if (props.creating === 'succeeded') {
            props.close();
            props.refreshList();
        }
    });

    const onCreate = async () => {
        if (!props.name) {
            return;
        }
        props.createGroup(props.name, props.desc);
    }

    return (
        <Dialog
            aria-labelledby="dialog-title"
            open={props.open}>
            <DialogTitle id="dialog-title">Create group</DialogTitle>
            <TextField
                label="Name"
                error={props.nameError === null}
                helperText={props.nameError}
                onChange={(e) => props.updateName(e.target.value)} />
            <TextField
                label="Description"
                error={props.descError === null}
                helperText={props.descError}
                onChange={(e) => props.updateDescription(e.target.value)} />
            <Container>
                <Button variant="contained" onClick={props.close}>Cancel</Button>
                <Button variant="contained" onClick={() => onCreate()}>Create</Button>
            </Container>
        </Dialog>
    );
}