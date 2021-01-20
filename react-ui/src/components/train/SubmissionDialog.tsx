import { makeStyles, Dialog, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Submission } from "../../models/Submission";
import SubmissionProblemView from "./SubmissionProblemView";
import { GeneratedProblemId } from "../../models/Identificators";
import { examinationService } from "../../Services";

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
    submission: Submission;
}

export default function SubmissionDialog(props: ISubmissionDialogProps) {

    const onCancel = () => {
        props.onClose();
    };

    const onAnswer = async (ans: string, generatedProblemId: GeneratedProblemId) => {
        await examinationService.applyAnswer(
            props.submission.id,
            {
                answer: ans,
                generated_problem_id: generatedProblemId
            }
        );
        return true;
    };

    const onComplete = async () => {
        await examinationService.complete(props.submission.id);
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
                        Submission
                    </Typography>
                </Toolbar>
            </AppBar>
            <List
                className={classes.list}>
                {
                    props.submission.problem_set.problems.map((problem, index) =>
                        {
                            const answer = props.submission.answers.find(ans => ans.generated_problem_id === problem.id);

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