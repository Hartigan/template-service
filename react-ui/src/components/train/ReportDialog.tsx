import { makeStyles, Dialog, TextField, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem, Container } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Submission } from "../../models/Submission";
import { ExaminationService } from "../../services/ExaminationService";
import SubmissionProblemView from "./SubmissionProblemView";
import { GeneratedProblemId } from "../../models/Identificators";
import { Report } from "../../models/Report";
import ReportProblemView from "./ReportProblemView";
import ReportProblemSetView from "./ReportProblemSetView";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '100%',
    },
    inputLabel: {
        minWidth: 120,
    },
    fieldLabel: {
        fontSize: 14,
    },
}));

interface IState {
}

export interface IReportDialogProps {
    open: boolean;
    onClose: () => void;
    report: Report;
}

export default function ReportDialog(props: IReportDialogProps) {

    const [ state, setState ] = React.useState<IState>({
    }); 

    const onCancel = () => {
        props.onClose();
    };

    const classes = useStyles();

    return (
        <Dialog
            open={props.open}
            fullScreen>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        onClick={onCancel}>
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Report
                    </Typography>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                <ListItem key="problem_set">
                    <ReportProblemSetView report={props.report} />
                </ListItem>
                {
                    props.report.problem_set.problems.map(problem =>
                        {
                            return (
                                <ListItem
                                    key={"problem_" + problem.id}
                                    >
                                    <ReportProblemView
                                        problem={problem}
                                        />
                                </ListItem>
                            )
                        }
                    )
                }
            </List>
        </Dialog>
    );
};