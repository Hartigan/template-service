import { makeStyles, Button, TableRow, TableCell } from "@material-ui/core";
import React, { useEffect } from "react";
import { ExaminationService } from "../../services/ExaminationService";
import { SubmissionPreview } from "../../models/SubmissionPreview";
import { SubmissionId } from "../../models/Identificators";
import DateView from "../utils/DateView";

const useStyles = makeStyles(theme => ({
    row: {
    }
}));

interface IState {
    preview: SubmissionPreview | null;
}

export interface ISubmissionPreviewViewProps {
    submissionId: SubmissionId;
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
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

    const classes = useStyles();

    if (state.preview) {
        return (
            <TableRow
                className={classes.row}>
                <TableCell align="right">{state.preview.title}</TableCell>
                <TableCell align="right">{state.preview.author.username}</TableCell>
                <TableCell align="right">
                    <DateView date={state.preview.started_at} />
                </TableCell>
                <TableCell align="right">
                    <DateView date={state.preview.deadline} />
                </TableCell>
                <TableCell align="right">
                    <Button
                        size="small"
                        color="primary"
                        onClick={() => props.onShowSubmission(props.submissionId)}
                        >
                        Continue
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    return null;
};