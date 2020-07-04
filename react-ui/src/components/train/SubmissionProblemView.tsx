import { makeStyles, TextField, Typography, Card, CardContent, CardActions, Button } from "@material-ui/core";
import React from "react";
import { SubmissionProblem } from "../../models/Submission";
import ProblemView from "./ProblemView";
import { GeneratedProblemId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    inputLabel: {
        margin: "10px 0px 0px 0px",
        minWidth: 120,
    },
    title: {
        margin: "0px 0px 10px 0px",
    },
    status: {
        margin: "10px 0px 0px 0px",
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
                <Typography className={classes.status} variant="body2">
                    {state.answer} - answer aplied
                </Typography>
            )
        }
        return null;
    }

    const onAnswer = async () => {
        let result = await props.onAnswer(state.answer, props.problem.id);
        setState({
            ...state,
            isAnswered: result
        });
    };

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} variant="h6">
                    {props.problem.title}
                </Typography>
                <ProblemView view={props.problem.view} />
                <TextField
                    className={classes.inputLabel}
                    label="Answer"
                    value={state.answer}
                    onKeyDown={event => { if (event.keyCode === 13) { onAnswer(); } }}
                    onChange={(e) => setState({...state, answer: e.target.value})} />
                {answerStatus()}
            </CardContent>
            <CardActions>
                <Button
                    color="primary"
                    onClick={() => onAnswer()}>
                    Apply
                </Button>
            </CardActions>
        </Card>
    );
};