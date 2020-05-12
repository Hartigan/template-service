import { makeStyles, Box, Card, CardActionArea, CardContent, Typography, CardActions, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { SubmissionPreview } from "../../models/SubmissionPreview";
import { SubmissionId, ReportId } from "../../models/Identificators";

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

interface IState {
    preview: SubmissionPreview | null;
}

export interface ISubmissionPreviewViewProps {
    submissionId: SubmissionId;
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
    onShowReport: (reportId: ReportId) => void;
}

export default function SubmissionPreviewView(props: ISubmissionPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        preview: null,
    });

    useEffect(() => {
        let isCancelled = false;
        if (state.preview === null || state.preview.id !== props.submissionId) {
            props.examinationService
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

    const onShowReport = () => {
        if (state.preview?.report_id) {
            props.onShowReport(state.preview.report_id);
        }
    }

    const classes = useStyles();

    if (state.preview) {
        return (
            <Card className={classes.root}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
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
                        <Typography variant="body2" component="p">
                            {state.preview.started_at}
                        </Typography>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Deadline
                        </Typography>
                        <Typography variant="body2" component="p">
                            {state.preview.deadline}
                        </Typography>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Status
                        </Typography>
                        <Typography variant="body2" component="p">
                            {state.preview.completed ? "Completed" : "In progress"}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {state.preview.report_id
                        ? (
                            <Button
                                size="small"
                                color="primary"
                                onClick={onShowReport}
                                >
                                View report
                            </Button>
                        )
                        : (
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => props.onShowSubmission(props.submissionId)}
                                >
                                Continue
                            </Button>
                        )
                    }
                </CardActions>
            </Card>
        );
    }

    return (
        <Box className={classes.root}>
        </Box>
    );
};