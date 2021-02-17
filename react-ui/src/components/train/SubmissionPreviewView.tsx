import { makeStyles, Button, Card, CardContent, Typography, CardActions } from "@material-ui/core";
import React, { useEffect } from "react";
import { SubmissionId } from "../../models/Identificators";
import DateView from "../utils/DateView";
import Services from "../../Services";
import { SubmissionPreviewModel } from "../../models/domain";
import { GetSubmissionPreviewRequest } from "../../protobuf/examination_pb";

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
    preview: SubmissionPreviewModel | null;
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
            const request = new GetSubmissionPreviewRequest();
            request.setSubmissionId(props.submissionId);
            Services.examinationService
                .getSubmissionPreview(request)
                .then(reply => {
                    if (isCancelled) {
                        return;
                    }

                    const error = reply.getError();
                    if (error) {
                        Services.logger.error(error.getDescription());
                    }

                    const submission = reply.getPreview()?.toObject();
                    if (submission) {
                        setState({
                            ...state,
                            preview: submission
                        });
                    }
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
                        {state.preview.author?.username}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Started at
                    </Typography>
                    <DateView date={new Date(state.preview.startedAt)} />
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Deadline
                    </Typography>
                    <DateView date={new Date(state.preview.deadline)} />
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