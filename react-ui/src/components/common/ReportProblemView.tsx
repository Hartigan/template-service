import { makeStyles, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import React from "react";
import { ProblemReport } from "../../models/Report";
import ProblemView from "../train/ProblemView";
import DateView from "../utils/DateView";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
    header: {
        width: "100%",
    },
    content: {
        width: "100%",
    },
    title: {
        fontSize: 14,
    },
}));

export interface IReportProblemViewProps {
    problem: ProblemReport;
}

export default function ReportProblemView(props: IReportProblemViewProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.problem.title}
                    </Typography>
                    <ProblemView view={props.problem.view} />
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Answer
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.answer ? props.problem.answer : "Skipped"}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Answer timestamp
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.timestamp ? (<DateView date={props.problem.timestamp}/>) : "Skipped"}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Expected answer
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.expected_answer}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Status
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.is_correct ? "Correct" : "Incorrect"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};