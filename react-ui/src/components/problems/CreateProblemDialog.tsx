import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, FormControl } from "@material-ui/core";
import React from "react";
import { FoldersService } from "../../services/FoldersService";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import CloseIcon from '@material-ui/icons/Close';
import { Problem } from "../../models/Problem";
import { Controller } from "../../models/Controller";
import { View } from "../../models/View";
import { Validator } from "../../models/Validator";
import ControllerEditor from "./ControllerEditor";
import ViewEditor from "./ViewEditor";
import ValidatorEditor from "./ValidatorEditor";

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

export interface ICreateProblemDialogProps {
    open: boolean;
    onClose: () => void;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    fileExplorerState: FileExplorerState;
}

export default function CreateProblemDialog(props: ICreateProblemDialogProps) {

    const [ title, setTitle ] = React.useState<string>(""); 
    const [ controller, setController ] = React.useState<Controller>({
        language: "csharp",
        content: ""
    });
    const [ view, setView ] = React.useState<View>({
        language: "plain_text",
        content: ""
    });
    const [ validator, setValidator ] = React.useState<Validator>({
        language: "csharp",
        content: ""
    });

    const onCancel = () => {
        props.onClose();
    };

    const onSave = async () => {
        let curFolder = await props.fileExplorerState.currentFolderOrRoot();
        if (!curFolder) {
            return;
        }

        let problem : Problem = {
            id: "",
            title: title,
            controller: controller,
            view: view,
            validator: validator
        };

        let ans = await props.problemsService.create(curFolder.id, title, problem);
        let headId = ans.id;

        props.fileExplorerState.syncFolder(curFolder.id);

        props.onClose();
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
                        onClick={onCancel}>
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
                            onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <ControllerEditor
                        value={controller}
                        onChange={(v) => setController(v)}
                        disabled={false} />
                </ListItem>
                <ListItem>
                    <ViewEditor
                        value={view}
                        onChange={(v) => setView(v)}
                        disabled={false} />
                </ListItem>
                <ListItem>
                    <ValidatorEditor
                        value={validator}
                        onChange={(v) => setValidator(v)}
                        disabled={false} />
                </ListItem>
            </List>
        </Dialog>
    );
};