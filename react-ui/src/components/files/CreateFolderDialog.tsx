import { makeStyles, Dialog, DialogTitle, TextField, Container, Button } from "@material-ui/core";
import React from "react";
import PropTypes from 'prop-types';
import { FoldersService } from "../../services/FoldersService";
import { FileExplorerState } from "../../states/FileExplorerState";

const useStyles = makeStyles({
});

export interface ICreateFolderDialogProps {
    open: boolean;
    onClose: () => void;
    foldersService: FoldersService;
    fileExplorerState: FileExplorerState;
}

export default function CreateFolderDialog(props: ICreateFolderDialogProps) {
    const [ name, setName ] = React.useState<string>("");
    const [ error, setError ] = React.useState<boolean>(false);
    const [ helperText, setHelperText ] = React.useState<string>("");

    const updateName = (value: string) => {
        setName(value);
        setError(value.length === 0);
        setHelperText(error ? "Name is empty" : "")
    };

    const onCancel = () => props.onClose();
    const onCreate = async () => {
        if (!name) {
            return;
        }

        let curFolderId = await props.fileExplorerState.currentFolderOrRoot();

        if (curFolderId) {
            let ans = await props.foldersService.createFolder(name);
            await props.foldersService.addFolder(ans.id, curFolderId);
            props.fileExplorerState.syncFolder(curFolderId);
            props.onClose();
        }
    }

    return (
        <Dialog
            aria-labelledby="dialog-title"
            open={props.open}>
            <DialogTitle id="dialog-title">Create folder</DialogTitle>
            <TextField
                label="Name"
                error={error}
                helperText={helperText}
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