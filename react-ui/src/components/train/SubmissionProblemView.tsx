import { makeStyles, TextField, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React from "react";
import { SubmissionProblem } from "../../models/Submission";
import ProblemView from "./ProblemView";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { GeneratedProblemId } from "../../models/Identificators";
import ProblemSetPreview from "../problem_sets/ProblemSetPreview";

const useStyles = makeStyles(theme => ({
    list: {
        width: '100%',
    },
    inputLabel: {
        minWidth: 120,
    }
}));

interface IState {
    answer: string;
    isAnswered: boolean;
}

export interface ISubmissionProblemViewProps {
    problem: SubmissionProblem;
    answer: string | undefined;
    onAnswer: (answer: string, generatedProblemId: GeneratedProblemId) => Promise<boolean>;
}

export default function SubmissionProblemView(props: ISubmissionProblemViewProps) {

    const [ state, setState ] = React.useState<IState>({
        answer: props.answer ? props.answer : "",
        isAnswered: props.answer !== undefined
    }); 

    const classes = useStyles();

    const answerStatus = () => {
        if (state.isAnswered) {
            return (
                <ListItem>
                        <Typography variant="body2">
                            Answer aplied
                        </Typography>
                </ListItem>
            )
        }
        return <ListItem />
    }

    const onAnswer = async () => {
        let result = await props.onAnswer(state.answer, props.problem.id);
        setState({
            ...state,
            isAnswered: result
        });
    };

    return (
        <List
            className={classes.list}>
            <ListItem>
                <Typography variant="h6">
                    {props.problem.title}
                </Typography>
            </ListItem>
            <ListItem>
                <ProblemView view={props.problem.view} />
            </ListItem>
            <ListItem>
                <TextField
                    className={classes.inputLabel}
                    label="Answer"
                    value={state.answer}
                    onChange={(e) => setState({...state, answer: e.target.value})} />
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onAnswer}>
                    <PlayArrowIcon />
                </IconButton>
            </ListItem>
            {answerStatus()}
        </List>
    );
};