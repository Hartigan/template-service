import { makeStyles, Dialog, DialogTitle, TextField, Container, Button } from "@material-ui/core";
import React from "react";
import PropTypes from 'prop-types';
import { FoldersService } from "../../services/FoldersService";
import { FolderLink } from "../../models/Folder";

const useStyles = makeStyles({
});

interface IState {
    name: string;
    error: boolean;
    helperText: string;
}

export interface ICreateFolderDialogProps {
    open: boolean;
    onClose: () => void;
    foldersService: FoldersService;
    currentFolder: FolderLink;
}

export default function CreateFolderDialog(props: ICreateFolderDialogProps) {
    const [ state, setState ] = React.useState<IState>({
        name: "",
        error: false,
        helperText: ""
    });

    const clean = () => {
        setState({
            name: "",
            error: false,
            helperText: ""
        });
    };

    const updateName = (value: string) => {
        setState({
            name: value,
            error: value.length === 0,
            helperText: value.length === 0 ? "Name is empty" : ""
        });
    };

    const onCancel = () => {
        clean();
        props.onClose();
    }
    const onCreate = async () => {
        if (!state.name) {
            return;
        }

        await props.foldersService.createFolder(state.name, props.currentFolder.id);
        clean();
        props.onClose();
    }

    return (
        <Dialog
            aria-labelledby="dialog-title"
            open={props.open}>
            <DialogTitle id="dialog-title">Create folder</DialogTitle>
            <TextField
                label="Name"
                error={state.error}
                helperText={state.helperText}
                onChange={(e) => updateName(e.target.value)} />
            <Container>
                <Button variant="contained" onClick={() => onCreate()}>Create</Button>
                <Button variant="contained" onClick={onCancel}>Cancel</Button>
            </Container>
        </Dialog>
    );
}

CreateFolderDialog.propTypes = {
    open: PropTypes.bool.isRequired
};