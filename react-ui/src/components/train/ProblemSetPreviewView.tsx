import { makeStyles, Button, TableCell, TableRow } from "@material-ui/core";
import React, { useEffect } from "react";
import { CommitId, SubmissionId } from "../../models/Identificators";
import { ProblemSetPreview } from "../../models/ProblemSetPreview";
import { ExaminationService } from "../../services/ExaminationService";
import { Head } from "../../models/Head";
import TagsView from "../utils/TagsView";


const useStyles = makeStyles(theme => ({
    row: {
    }
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
            <TableRow className={classes.row}>
                <TableCell align="right">{state.preview.title}</TableCell>
                <TableCell align="right">{state.preview.duration / 60}</TableCell>
                <TableCell align="right">{state.preview.problems_count}</TableCell>
                <TableCell align="right">{state.preview.author.username}</TableCell>
                <TableCell align="right">
                    <Button
                        size="small"
                        color="primary"
                        onClick={onStart}
                        >
                        Start
                    </Button>
                </TableCell>
                <TableCell align="right">
                    <TagsView tags={props.head.tags} />
                </TableCell>
            </TableRow>
        );
    }

    return null;
};