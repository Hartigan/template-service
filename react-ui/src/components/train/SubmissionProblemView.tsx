import { makeStyles, TextField, Typography, Card, CardContent } from "@material-ui/core";
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
    sub: NodeJS.Timeout | null;
}

export interface ISubmissionProblemViewProps {
    problem: SubmissionProblem;
    answer: string | undefined;
    onAnswer: (answer: string, generatedProblemId: GeneratedProblemId) => Promise<boolean>;
}

export default function SubmissionProblemView(props: ISubmissionProblemViewProps) {

    const [ state, setState ] = React.useState<IState>({
        answer: props.answer ? props.answer : "",
        sub: null
    }); 

    const classes = useStyles();

    const onAnswerChanged = (ans: string) => {
        if (state.sub) {
            clearTimeout(state.sub);
        };

        setState({
            ...state,
            sub: setTimeout(async () => {
                await props.onAnswer(ans, props.problem.id);
            }, 200),
            answer: ans
        });
    }

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
                    onChange={(e) => onAnswerChanged(e.target.value)} />
            </CardContent>
        </Card>
    );
};