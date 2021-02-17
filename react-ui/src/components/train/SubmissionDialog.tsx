import { makeStyles, Dialog, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import SubmissionProblemView from "./SubmissionProblemView";
import { GeneratedProblemId, ReportId } from "../../models/Identificators";
import Services from "../../Services";
import { SubmissionModel } from "../../models/domain";
import { ApplyAnswerRequest, CompleteSubmissionRequest } from "../../protobuf/examination_pb";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '60%',
        minWidth: "360px",
        margin: "auto",
    },
    inputLabel: {
        minWidth: 120,
    }
}));

export interface ISubmissionDialogProps {
    open: boolean;
    onClose: () => void;
    onComplete: (id: ReportId) => void;
    submission: SubmissionModel;
}

export default function SubmissionDialog(props: ISubmissionDialogProps) {

    const onCancel = () => {
        props.onClose();
    };

    const onAnswer = async (ans: string, generatedProblemId: GeneratedProblemId) => {
        const request = new ApplyAnswerRequest();
        request.setSubmissionId(props.submission.id);
        request.setGeneratedProblemId(generatedProblemId);
        request.setAnswer(ans);
        const reply = await Services.examinationService.applyAnswer(request);
        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        return true;
    };

    const onComplete = async () => {
        const request = new CompleteSubmissionRequest();
        request.setSubmissionId(props.submission.id);
        const reply = await Services.examinationService.completeSubmission(request);

        const error = reply.getError();
        if (error) {
            Services.logger.error(error.getDescription());
        }
        const reportId = reply.getReportId();
        if (reportId) {
            props.onComplete(reportId);
        }
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
                        Submission
                    </Typography>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                {
                    props.submission.problemSet?.problemsList?.map((problem, index) =>
                        {
                            const answer = props.submission.answersList.find(ans => ans.id === problem.id);

                            return (
                                <ListItem
                                    key={"problem_" + problem.id}
                                    >
                                    <SubmissionProblemView
                                        index={index}
                                        problem={problem}
                                        answer={answer?.answer}
                                        onAnswer={onAnswer}
                                        />
                                </ListItem>
                            )
                        }
                    )
                }
                <ListItem>
                    <Button
                        onClick={onComplete}
                        variant="contained"
                        color="primary"
                        >
                        Complete
                    </Button>
                </ListItem>
            </List>
        </Dialog>
    );
};