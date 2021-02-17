import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import { SubmissionId } from '../../models/Identificators';
import SubmissionPreviewView from './SubmissionPreviewView';
import { SubmissionPreviewModel } from '../../models/domain';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexGrow: 1,
    },
}));

export interface ISubmissionsListViewProps {
    onShowSubmission: (submissionId: SubmissionId) => void;
    submissions: Array<SubmissionPreviewModel>;
}

export default function SubmissionsListView(props: ISubmissionsListViewProps) {

    const classes = useStyles();

    return (
        <Box className={classes.root} flexWrap="wrap">
            {
                props.submissions.map(submission => (
                    <SubmissionPreviewView
                        key={"submission_" + submission.id}
                        submission={submission}
                        onShowSubmission={props.onShowSubmission}
                        />
                ))
            }
        </Box>
    );
}