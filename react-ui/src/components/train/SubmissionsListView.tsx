import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import { ExaminationService } from '../../services/ExaminationService';
import { SubmissionId } from '../../models/Identificators';
import SubmissionPreviewView from './SubmissionPreviewView';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexGrow: 1,
    },
}));

export interface ISubmissionsListViewProps {
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
    submissionsIds: Array<SubmissionId>;
}

export default function SubmissionsListView(props: ISubmissionsListViewProps) {

    const classes = useStyles();

    return (
        <Box className={classes.root} flexWrap="wrap">
            {
                props.submissionsIds.map(submissionId => (
                    <SubmissionPreviewView
                        key={"submission_" + submissionId}
                        submissionId={submissionId}
                        examinationService={props.examinationService}
                        onShowSubmission={props.onShowSubmission}
                        />
                ))
            }
        </Box>
    );
}