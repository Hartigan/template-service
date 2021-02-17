import { makeStyles, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import React from "react";
import { ProblemReportModel } from "../../models/domain";
import { View } from "../../protobuf/domain_pb";
import ProblemView from "../train/ProblemView";
import TimeSpanView from "../utils/TimeSpanView";
import StatusView from "./StatusView";

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
    startTime: Date;
    problem: ProblemReportModel;
    index: number;
}

export default function ReportProblemView(props: IReportProblemViewProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.index}. {props.problem.title}
                    </Typography>
                    <ProblemView view={props.problem.view ?? { language: View.Language.PLAIN_TEXT, content: "" }} />
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Answer
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.userAnswer?.value ?? "Skipped"}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Answer timestamp
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.userAnswer?.timestamp ? (<TimeSpanView fromDate={new Date(props.startTime)} toDate={new Date(props.problem.userAnswer?.timestamp)}/>) : "Skipped"}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Expected answer
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.problem.expectedAnswer}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Status
                    </Typography>
                    <Typography variant="body2" component="p">
                        <StatusView isCorrect={props.problem.isCorrect} />
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};