import { makeStyles, Box, Card, CardActionArea, CardContent, Typography, CardActions, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { CommitId } from "../../models/Identificators";
import { ProblemSetPreview } from "../../models/ProblemSetPreview";
import { ExaminationService } from "../../services/ExaminationService";



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
    commitId: CommitId;
    examinationService: ExaminationService;
}

export default function ProblemSetPreviewView(props: IProblemSetPreviewViewProps) {

    const [ state, setState ] = React.useState<IState>({
        preview: null,
        commitId: null
    });

    const refresh = () => {
        const commitId = props.commitId;
        props.examinationService
            .getProblemSetPreview(commitId)
            .then(preview => {
                setState({
                    ...state,
                    preview: preview,
                    commitId: commitId
                });
            });
    };

    useEffect(() => {
        if (state.commitId === null || state.commitId !== props.commitId) {
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
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary">
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