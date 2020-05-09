import { makeStyles, Box, Card, CardActionArea, CardContent, Typography, CardActions, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { SubmissionPreview } from "../../models/SubmissionPreview";
import { SubmissionId } from "../../models/Identificators";

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
}

export default function SubmissionPreviewView(props: ISubmissionPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        preview: null,
    });

    const refresh = async () => {
        let submission = await props.examinationService.getSubmissionPreview(props.submissionId);
        setState({
            ...state,
            preview: submission
        });
    };

    useEffect(() => {
        if (state.preview === null || state.preview.id !== props.submissionId) {
            refresh();
        }
    });

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
                            <Button size="small" color="primary">
                                View report
                            </Button>
                        )
                        : (
                            <Button size="small" color="primary">
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