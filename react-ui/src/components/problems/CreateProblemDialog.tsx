import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, InputLabel, Select, MenuItem, FormControl } from "@material-ui/core";
import React from "react";
import { FoldersService } from "../../services/FoldersService";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import CloseIcon from '@material-ui/icons/Close';
import { Problem } from "../../models/Problem";

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
    const [ controller, setController ] = React.useState<string>("");
    const [ controllerLanguage, setControllerLanguage ] = React.useState("csharp");
    const [ view, setView ] = React.useState<string>("");
    const [ viewLanguage, setViewLanguage ] = React.useState("plain_text");
    const [ validator, setValidator ] = React.useState<string>("");
    const [ validatorLanguage, setValidatorLanguage ] = React.useState("csharp");

    const onCancel = () => {
        props.onClose();
    };

    const onSave = async () => {
        let curFolderId = await props.fileExplorerState.currentFolderOrRoot();
        if (!curFolderId) {
            return;
        }

        let problem : Problem = {
            id: "",
            title: title,
            controller: {
                language: controllerLanguage,
                content: controller
            },
            view: {
                language: viewLanguage,
                content: view
            },
            validator: {
                language: validatorLanguage,
                content: validator
            }
        };

        let ans = await props.problemsService.create(curFolderId, title, problem);
        let headId = ans.id;

        props.fileExplorerState.syncFolder(curFolderId);

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
                    <FormControl className={classes.formControl}>
                        <InputLabel
                            id="controller-language-label"
                            className={classes.inputLabel}>
                            Language
                        </InputLabel>
                        <Select
                            labelId="controller-language-label"
                            value={controllerLanguage}
                            onChange={(e) => setControllerLanguage(e.target.value as string)}>
                            <MenuItem value={"csharp"}>C#</MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Controller"
                            multiline
                            rows="5"
                            onChange={(e) => setController(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="view-language-label">
                            Language
                        </InputLabel>
                        <Select
                            labelId="view-language-label"
                            value={viewLanguage}
                            onChange={(e) => setViewLanguage(e.target.value as string)}>
                            <MenuItem value={"plain_text"}>Plain</MenuItem>
                            <MenuItem value={"markdown"}>Markdown</MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="View"
                            multiline
                            rows="5"
                            onChange={(e) => setView(e.target.value)} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="validator-language-label">
                            Language
                        </InputLabel>
                        <Select
                            labelId="validator-language-label"
                            value={validatorLanguage}
                            onChange={(e) => setValidatorLanguage(e.target.value as string)}>
                            <MenuItem value={"csharp"}>C#</MenuItem>
                        </Select>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Validator"
                            multiline
                            rows="5"
                            onChange={(e) => setValidator(e.target.value)} />
                    </FormControl>
                </ListItem>
            </List>
        </Dialog>
    );
};