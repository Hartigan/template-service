import { makeStyles, Box, List, ListItem, FormControl, TextField, Container, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { ProblemsService } from "../../services/ProblemsService";
import { Commit } from "../../models/Commit";
import ControllerEditor from "./ControllerEditor";
import ViewEditor from "./ViewEditor";
import ValidatorEditor from "./ValidatorEditor";
import { Controller } from "../../models/Controller";
import { View } from "../../models/View";
import { Validator } from "../../models/Validator";
import { Problem } from "../../models/Problem";
import { FileExplorerState } from "../../states/FileExplorerState";
import { CommitId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%"
    },
    list: {
        width: "100%",
    },
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
        minWidth: 120,
    },
}));

export interface IProblemEditorProps {
    commit: Commit;
    problemsService: ProblemsService;
    fileExplorerState: FileExplorerState;
}

export default function ProblemEditor(props: IProblemEditorProps) {

    const [ commitIsLoaded, setCommitIsLoaded ] = React.useState(props.commit.id);
    const [ disabled, setDisabled ] = React.useState(true);
    const [ description, setDescription ] = React.useState(props.commit.description);
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

    const sync = (commit: Commit) => {
        setCommitIsLoaded(commit.id);
        props.problemsService
            .get(commit.id)
            .then(problem => {
                setTitle(problem.title);
                setController(problem.controller);
                setView(problem.view);
                setValidator(problem.validator);
                setDescription(commit.description);
            });
    };

    useEffect(() => {
        if (commitIsLoaded === props.commit.id) {
            return;
        }
        sync(props.commit);
    });

    const onCancel = () => {
        setDescription(props.commit.description);
        setDisabled(true);
        sync(props.commit);
    };
    const onEdit = () => {
        setDescription("");
        setDisabled(false);
    };
    const onSave = async () => {
        let problem : Problem = {
            id: "",
            title: title,
            controller: controller,
            view: view,
            validator: validator
        };
        await props.problemsService.update(
            props.commit.head_id,
            description,
            problem
        );
        setDisabled(true);
        props.fileExplorerState.syncHead(props.commit.head_id);
    };

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container>
                <Button onClick={onEdit}>Edit</Button>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onSave}>Save</Button>
            </Container>
            <List
                className={classes.list}>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Change description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={disabled} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={disabled} />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <ControllerEditor
                        value={controller}
                        onChange={(v) => setController(v)}
                        disabled={disabled} />
                </ListItem>
                <ListItem>
                    <ViewEditor
                        value={view}
                        onChange={(v) => setView(v)}
                        disabled={disabled} />
                </ListItem>
                <ListItem>
                    <ValidatorEditor
                        value={validator}
                        onChange={(v) => setValidator(v)}
                        disabled={disabled} />
                </ListItem>
            </List>
        </Box>
    );
};