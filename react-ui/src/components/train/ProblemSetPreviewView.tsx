import { makeStyles, Box, Card, CardContent, Typography, CardActions, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { CommitId, SubmissionId } from "../../models/Identificators";
import { ProblemSetPreview } from "../../models/ProblemSetPreview";
import { ExaminationService } from "../../services/ExaminationService";
import { Head } from "../../models/Head";



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
    preview: ProblemSetPreview | null;
    commitId: CommitId | null;
}

export interface IProblemSetPreviewViewProps {
    head: Head;
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
}

export default function ProblemSetPreviewView(props: IProblemSetPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        preview: null,
        commitId: null
    });

    useEffect(() => {
        let isCancelled = false;
        if (state.commitId === null || state.commitId !== props.head.commit.id) {
            const commitId = props.head.commit.id;
            props.examinationService
                .getProblemSetPreview(commitId)
                .then(preview => {
                    if (isCancelled) {
                        return;
                    }
                    setState({
                        ...state,
                        preview: preview,
                        commitId: commitId
                    });
                });
        }

        return () => {
            isCancelled = true;
        }
    });

    const onStart = async () => {
        let submissionId = await props.examinationService.start(props.head.id);
        props.onShowSubmission(submissionId.id);
    };

    const classes = useStyles();

    if (state.preview) {
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {state.preview.title}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Duration, s
                    </Typography>
                    <Typography variant="body2" component="p">
                        {state.preview.duration}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Problems count
                    </Typography>
                    <Typography variant="body2" component="p">
                        {state.preview.problems_count}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Author
                    </Typography>
                    <Typography variant="body2" component="p">
                        {state.preview.author.username}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        color="primary"
                        onClick={onStart}
                        >
                        Start
                    </Button>
                </CardActions>
            </Card>
        );
    }

    return (
        <Box className={classes.root}>
        </Box>
    );
};