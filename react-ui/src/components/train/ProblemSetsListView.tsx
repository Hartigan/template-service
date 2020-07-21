import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import { Head } from '../../models/Head';
import { ExaminationService } from '../../services/ExaminationService';
import ProblemSetPreviewView from './ProblemSetPreviewView';
import { SubmissionId } from '../../models/Identificators';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexGrow: 1,
    },
    tableHeaderCell: {
        fontWeight: "bold"
    },
}));

export interface IProblemSetsListViewProps {
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
    problemSets: Array<Head>;
}

export default function ProblemSetsListView(props: IProblemSetsListViewProps) {

    const classes = useStyles();

    return (
        <Box className={classes.root} flexWrap="wrap">
            {
                props.problemSets.map(problemSet => (
                    <ProblemSetPreviewView
                        key={"problem_set_" + problemSet.id}
                        head={problemSet}
                        examinationService={props.examinationService}
                        onShowSubmission={props.onShowSubmission}
                        />
                ))
            }
        </Box>
    );
}