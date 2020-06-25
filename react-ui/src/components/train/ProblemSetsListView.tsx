import * as React from 'react'
import { makeStyles, Paper, TableContainer, TableHead, Table, TableCell, TableBody, TableRow } from '@material-ui/core';
import { Head } from '../../models/Head';
import { ExaminationService } from '../../services/ExaminationService';
import ProblemSetPreviewView from './ProblemSetPreviewView';
import { SubmissionId } from '../../models/Identificators';

const useStyles = makeStyles(theme => ({
    root: {
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
        <TableContainer
            className={classes.root}
            component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderCell} align="right">Title</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Duration, min</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Problems count</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Author</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Actions</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Tags</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
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
                </TableBody>
            </Table>
            
        </TableContainer>
    );
}