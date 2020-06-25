import * as React from 'react'
import { makeStyles, TableHead, TableBody, TableContainer, Paper, Table, TableRow, TableCell } from '@material-ui/core';
import { ExaminationService } from '../../services/ExaminationService';
import { SubmissionId } from '../../models/Identificators';
import SubmissionPreviewView from './SubmissionPreviewView';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableHeaderCell: {
        fontWeight: "bold"
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
        <TableContainer
            className={classes.root}
            component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderCell} align="right">Title</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Author</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Started at</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Deadline</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
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
                </TableBody>
            </Table>
        </TableContainer>
    );
}