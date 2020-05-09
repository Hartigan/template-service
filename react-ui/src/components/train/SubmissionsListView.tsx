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
    submissionsIds: Array<SubmissionId> | null;
}

export interface ISubmissionsListViewProps {
    examinationService: ExaminationService;
}

export default function SubmissionsListView(props: ISubmissionsListViewProps) {

    const [ state, setState ] = React.useState<IState>({
        submissionsIds: null
    });

    const classes = useStyles();

    const fetchSubmissionsIds = async () => {
        let submissionsIds = await props.examinationService.getSubmissions();
        setState({
            ...state,
            submissionsIds: submissionsIds
        });
    };

    React.useEffect(() => {
        if (state.submissionsIds === null) {
            fetchSubmissionsIds();
        }
    });

    if (state.submissionsIds) {
        return (
            <List className={classes.root}>
                {
                    state.submissionsIds.map(submissionId => (
                        <ListItem
                            key={"submission_" + submissionId}
                            >
                            <SubmissionPreviewView
                                submissionId={submissionId}
                                examinationService={props.examinationService}
                                />
                        </ListItem>
                    ))
                }
            </List>
        );
    }

    return (<div/>);
}