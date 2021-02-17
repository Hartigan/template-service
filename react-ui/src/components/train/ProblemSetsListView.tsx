import * as React from 'react'
import { makeStyles, Box } from '@material-ui/core';
import ProblemSetPreviewView from './ProblemSetPreviewView';
import { HeadId } from '../../models/Identificators';
import { HeadModel, ProblemSetPreviewModel } from '../../models/domain';

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
    onStartSubmission: (headId: HeadId) => void;
    problemSets: Array<{ head: HeadModel; preview: ProblemSetPreviewModel; }>;
}

export default function ProblemSetsListView(props: IProblemSetsListViewProps) {

    const classes = useStyles();

    return (
        <Box className={classes.root} flexWrap="wrap">
            {
                props.problemSets.map(problemSet => (
                    <ProblemSetPreviewView
                        key={"problem_set_" + problemSet.head.id}
                        head={problemSet.head}
                        preview={problemSet.preview}
                        onStartSubmission={props.onStartSubmission}
                        />
                ))
            }
        </Box>
    );
}