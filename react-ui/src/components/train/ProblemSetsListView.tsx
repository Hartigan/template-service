import * as React from 'react'
import { makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import { Head } from '../../models/Head';
import { ExaminationService } from '../../services/ExaminationService';
import ProblemSetPreviewView from './ProblemSetPreviewView';
import { SubmissionId } from '../../models/Identificators';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

interface IState {
}

export interface IProblemSetsListViewProps {
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
    problemSets: Array<Head>;
}

export default function ProblemSetsListView(props: IProblemSetsListViewProps) {

    const [ state, setState ] = React.useState<IState>({
    });

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.problemSets.map(problemSet => (
                    <ListItem
                        key={"head_" + problemSet.id}
                        >
                        <ProblemSetPreviewView
                            head={problemSet}
                            examinationService={props.examinationService}
                            onShowSubmission={props.onShowSubmission}
                            />
                    </ListItem>
                ))
            }
        </List>
    );
}