import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, FormControl } from "@material-ui/core";
import React, { useEffect } from "react";
import CloseIcon from '@material-ui/icons/Close';
import ControllerEditor from "../ControllerEditor";
import ViewEditor from "../ViewEditor";
import ValidatorEditor from "../ValidatorEditor";
import { FolderId } from "../../../models/Identificators";
import { ControllerModel, ProblemModel, ValidatorModel, ViewModel } from "../../../models/domain";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '100%',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    inputLabel: {
        minWidth: 120,
    }
}));

export interface ICreateProblemDialogParameters {
    open: boolean;
    title: string;
    controller: ControllerModel;
    view: ViewModel;
    validator: ValidatorModel;
    creating: 'idle' | 'pending' | 'succeeded';
    folderId: FolderId | null;
};

export interface ICreateProblemDialogActions {
    create(folderId: FolderId, title: string, problem: ProblemModel): void;
    close(): void;
    updateFolder(folderId: FolderId): void;
    updateTitle(title: string): void;
    updateController(controller: ControllerModel): void;
    updateView(view: ViewModel): void;
    updateValidator(validator: ValidatorModel): void;
};

export interface ICreateProblemDialogProps extends ICreateProblemDialogParameters, ICreateProblemDialogActions {
};

export default function CreateProblemDialog(props: ICreateProblemDialogProps) {

    useEffect(() => {
        if (props.creating === 'succeeded' && props.folderId) {
            props.updateFolder(props.folderId);
            props.close()
        }
    });

    const onSave = () => {
        if (props.folderId === null) {
            return;
        }

        let problem : ProblemModel = {
            id: "",
            title: props.title,
            controller: props.controller,
            view: props.view,
            validator: props.validator
        };

        props.create(props.folderId, props.title, problem);
    };

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            fullScreen>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        onClick={props.close}>
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Problem
                    </Typography>
                    <Button
                        autoFocus
                        color="inherit"
                        onClick={onSave}>
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Title"
                            onChange={(e) => props.updateTitle(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <ControllerEditor
                        value={props.controller}
                        onChange={props.updateController}
                        disabled={false} />
                </ListItem>
                <ListItem>
                    <ViewEditor
                        value={props.view}
                        onChange={props.updateView}
                        disabled={false} />
                </ListItem>
                <ListItem>
                    <ValidatorEditor
                        value={props.validator}
                        onChange={props.updateValidator}
                        disabled={false} />
                </ListItem>
            </List>
        </Dialog>
    );
};