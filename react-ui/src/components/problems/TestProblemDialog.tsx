import { makeStyles, Dialog, TextField, AppBar, Toolbar, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React from "react";
import { ProblemsService } from "../../services/ProblemsService";
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { GeneratedProblem } from "../../models/GeneratedProblem";
import { CommitId } from "../../models/Identificators";
import ProblemView from "../train/ProblemView";

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
    inputLabel: {
        minWidth: 120,
    }
}));

interface ITestProblemState {
    answer: string;
    answerIsValid: boolean | null;
    seed: number;
}

export interface ITestProblemDialogProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (seed: number) => void;
    commitId: CommitId;
    generatedProblem: GeneratedProblem;
    problemsService: ProblemsService;
}

export default function TestProblemDialog(props: ITestProblemDialogProps) {

    const [ state, setState ] = React.useState<ITestProblemState>({
        answer: "",
        answerIsValid: null,
        seed: props.generatedProblem.seed
    }); 

    const onCancel = () => {
        props.onClose();
    };

    const onUpdate = () => {
        props.onUpdate(state.seed);
    }

    const onValidate = async () => {
        let result = await props.problemsService.validate(
            props.commitId,
            props.generatedProblem.answer,
            state.answer
        );
        setState({
            ...state,
            answerIsValid: result
        });
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
                        Test your problem
                    </Typography>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                <ListItem>
                    <TextField
                        className={classes.inputLabel}
                        label="Seed"
                        value={state.seed}
                        onChange={(e) => setState({...state, seed: parseInt(e.target.value)})} />
                        <IconButton 
                            edge="end"
                            color="inherit"
                            onClick={onUpdate}>
                            <RefreshIcon />
                        </IconButton>
                    </ListItem>
                <ListItem>
                    <ProblemView view={props.generatedProblem.view} />
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Expected answer: {props.generatedProblem.answer}
                    </Typography>
                </ListItem>
                <ListItem>
                    <TextField
                        className={classes.inputLabel}
                        label="Test answer"
                        value={state.answer}
                        onChange={(e) => setState({...state, answer: e.target.value})} />
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={onValidate}>
                            <PlayArrowIcon />
                        </IconButton>
                </ListItem>
                <ListItem>
                    <Typography variant="body1">
                        Result: {state.answerIsValid === null ? "" : (state.answerIsValid ? "Correct" : "Incorrect")}
                    </Typography>
                </ListItem>
            </List>
        </Dialog>
    );
};