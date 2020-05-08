import * as React from 'react'
import { makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import { Head } from '../../models/Head';
import { ExaminationService } from '../../services/ExaminationService';
import ProblemSetPreviewView from './ProblemSetPreviewView';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    }
}));

interface IState {
    heads: Array<Head> | null;
}

export interface IProblemSetsListViewProps {
    examinationService: ExaminationService;
}

export default function ProblemSetsListView(props: IProblemSetsListViewProps) {

    const [ state, setState ] = React.useState<IState>({
        heads: null
    });

    const classes = useStyles();

    const fetchProblemSets = async () => {
        let heads = await props.examinationService.getProblemSets();
        setState({
            ...state,
            heads: heads
        });
    };

    React.useEffect(() => {
        if (state.heads === null) {
            fetchProblemSets();
        }
    });

    if (state.heads) {
        return (
            <List className={classes.root}>
                {
                    state.heads.map(head => (
                        <ListItem
                            key={"head_" + head.id}
                            >
                            <ProblemSetPreviewView
                                commitId={head.commit.id}
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