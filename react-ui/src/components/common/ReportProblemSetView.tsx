import { makeStyles, Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import React from "react";
import { ReportModel } from "../../models/domain";
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

export interface IReportProblemSetViewProps {
    report: ReportModel;
}

export default function ReportProblemSetView(props: IReportProblemSetViewProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5">
                        {props.report.problemSet?.title}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Author
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.report.author?.username}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Started at
                    </Typography>
                    <Typography variant="body2" component="p">
                        <DateView date={new Date(props.report.startedAt)} />
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Finished at
                    </Typography>
                    <Typography variant="body2" component="p">
                        <DateView date={new Date(props.report.finishedAt)} />
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};