import { makeStyles, Dialog, DialogTitle, TextField, Container, Button } from "@material-ui/core";
import React from "react";
import { PermissionsService } from "../../services/PermissionsService";
import { isNull } from "util";

const useStyles = makeStyles({
});

interface IState {
    name: string;
    nameError: string | null;
    desc: string;
    descError: string | null;
}

export interface ICreateGroupDialogProps {
    open: boolean;
    onClose: () => void;
    permissionsService: PermissionsService;
}

export default function CreateGroupDialog(props: ICreateGroupDialogProps) {
    const [ state, setState ] = React.useState<IState>({
        name: "",
        desc: "",
        nameError: null,
        descError: null
    });

    const clean = () => {
        setState({
            name: "",
            desc: "",
            nameError: null,
            descError: null
        });
    };

    const updateName = (value: string) => {
        setState({
            ...state,
            name: value,
            nameError: value === "" ? "Name is empty" : null
        });
    };

    const updateDesc = (value: string) => {
        setState({
            ...state,
            desc: value,
            descError: value === "" ? "Description is empty" : null
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

        let ans = await props.permissionsService.createGroup(state.name, state.desc);
        clean();
        props.onClose();
    }

    return (
        <Dialog
            aria-labelledby="dialog-title"
            open={props.open}>
            <DialogTitle id="dialog-title">Create group</DialogTitle>
            <TextField
                label="Name"
                error={isNull(state.nameError)}
                helperText={state.nameError}
                onChange={(e) => updateName(e.target.value)} />
            <TextField
                label="Description"
                error={isNull(state.descError)}
                helperText={state.descError}
                onChange={(e) => updateDesc(e.target.value)} />
            <Container>
                <Button variant="contained" onClick={() => onCreate()}>Create</Button>
                <Button variant="contained" onClick={onCancel}>Cancel</Button>
            </Container>
        </Dialog>
    );
}