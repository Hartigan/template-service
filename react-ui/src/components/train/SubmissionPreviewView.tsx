import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React from "react";
import { SubmissionId } from "../../models/Identificators";
import DateView from "../utils/DateView";
import { SubmissionPreviewModel } from "../../models/domain";

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

export interface ISubmissionPreviewViewProps {
    submission: SubmissionPreviewModel;
    onShowSubmission: (submissionId: SubmissionId) => void;
}

export default function SubmissionPreviewView(props: ISubmissionPreviewViewProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Title
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.submission.title}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Author
                </Typography>
                <Typography variant="body2" component="p">
                    {props.submission.author?.username}
                </Typography>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Started at
                </Typography>
                <DateView date={new Date(props.submission.startedAt)} />
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Deadline
                </Typography>
                <DateView date={new Date(props.submission.deadline)} />
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.onShowSubmission(props.submission.id)}
                    >
                    Continue
                </Button>
            </CardActions>
        </Card>
    );
};