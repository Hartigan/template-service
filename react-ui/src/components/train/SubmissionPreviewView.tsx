import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React, { useEffect } from "react";
import { SubmissionPreview } from "../../models/SubmissionPreview";
import { SubmissionId } from "../../models/Identificators";
import DateView from "../utils/DateView";
import { examinationService } from "../../Services";

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

interface IState {
    preview: SubmissionPreview | null;
}

export interface ISubmissionPreviewViewProps {
    submissionId: SubmissionId;
    onShowSubmission: (submissionId: SubmissionId) => void;
}

export default function SubmissionPreviewView(props: ISubmissionPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        preview: null,
    });

    useEffect(() => {
        let isCancelled = false;
        if (state.preview === null || state.preview.id !== props.submissionId) {
            examinationService
                .getSubmissionPreview(props.submissionId)
                .then(submission => {
                    if (isCancelled) {
                        return;
                    }
                    setState({
                        ...state,
                        preview: submission
                    });
                });
        }

        return () => {
            isCancelled = true;
        }
    });

    const classes = useStyles();

    if (state.preview) {
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Title
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {state.preview.title}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Author
                    </Typography>
                    <Typography variant="body2" component="p">
                        {state.preview.author.username}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Started at
                    </Typography>
                    <DateView date={state.preview.started_at} />
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Deadline
                    </Typography>
                    <DateView date={state.preview.deadline} />
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        onClick={() => props.onShowSubmission(props.submissionId)}
                        >
                        Continue
                    </Button>
                </CardActions>
            </Card>
        );
    }

    return null;
};