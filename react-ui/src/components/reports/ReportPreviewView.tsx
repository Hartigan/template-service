import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React from "react";
import DateView from "../utils/DateView";
import { ReportId } from "../../models/Identificators";
import { ReportModel } from "../../models/domain";

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
    preview: ReportModel;
    onOpenShare: (reportId: ReportId) => void;
    onOpenReport: (report: ReportModel) => void;
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
                    {props.preview.problemSet?.title}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    User
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.author?.username}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Started at
                </Typography>
                <DateView date={new Date(props.preview.startedAt)} />
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Finished at
                </Typography>
                <DateView date={new Date(props.preview.startedAt)} />
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Result
                </Typography>
                <Typography variant="body2" component="p">
                    {props.preview.problemSet?.problemsList?.map(x => (x.isCorrect ? 1 : 0) as number).reduce((sum, x) => sum + x)} of {props.preview.problemSet?.problemsList.length ?? 0}
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