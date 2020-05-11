import * as React from 'react'
import { makeStyles, List, ListItem } from '@material-ui/core';
import { ExaminationService } from '../../services/ExaminationService';
import { SubmissionId } from '../../models/Identificators';
import SubmissionPreviewView from './SubmissionPreviewView';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

interface IState {
}

export interface ISubmissionsListViewProps {
    examinationService: ExaminationService;
    onShowSubmission: (submissionId: SubmissionId) => void;
    submissionsIds: Array<SubmissionId>;
}

export default function SubmissionsListView(props: ISubmissionsListViewProps) {

    const [ state, setState ] = React.useState<IState>({
    });

    const classes = useStyles();

    return (
        <List className={classes.root}>
            {
                props.submissionsIds.map(submissionId => (
                    <ListItem
                        key={"submission_" + submissionId}
                        >
                        <SubmissionPreviewView
                            submissionId={submissionId}
                            examinationService={props.examinationService}
                            onShowSubmission={props.onShowSubmission}
                            />
                    </ListItem>
                ))
            }
        </List>
    );
}