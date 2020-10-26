import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React from "react";
import DateView from "../utils/DateView";
import { Report } from "../../models/Report";
import { ReportId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: 320,
        flexGrow: 1,
        margin: "8px"
    },
    title: {
        fontSize: 14,
    },
}));

export interface IReportPreviewViewProps {
    preview: Report;
    onOpenShare: (reportId: ReportId) => void;
    onOpenReport: (report: Report) => void;
}

export default function ReportPreviewView(props: IReportPreviewViewProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Title
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.preview.problem_set.title}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    User
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.author.username}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Started at
                </Typography>
                <DateView date={props.preview.started_at} />
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Finished at
                </Typography>
                <DateView date={props.preview.started_at} />
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Result
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.problem_set.problems.map(x => (x.is_correct ? 1 : 0) as number).reduce((sum, x) => sum + x)} of {props.preview.problem_set.problems.length}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.onOpenReport(props.preview)}
                    >
                    View report
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.onOpenShare(props.preview.id)}
                    >
                    Share
                </Button>
            </CardActions>
        </Card>
    );
};