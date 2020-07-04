import { makeStyles, Dialog, Button, AppBar, Toolbar, IconButton, Typography, List, ListItem } from "@material-ui/core";
import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import { Submission } from "../../models/Submission";
import { ExaminationService } from "../../services/ExaminationService";
import SubmissionProblemView from "./SubmissionProblemView";
import { GeneratedProblemId } from "../../models/Identificators";

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
    examinationService: ExaminationService;
}

export default function SubmissionDialog(props: ISubmissionDialogProps) {

    const onCancel = () => {
        props.onClose();
    };

    const onAnswer = async (ans: string, generatedProblemId: GeneratedProblemId) => {
        await props.examinationService.applyAnswer(
            props.submission.id,
            {
                answer: ans,
                generated_problem_id: generatedProblemId
            }
        );
        return true;
    };

    const onComplete = async () => {
        await props.examinationService.complete(props.submission.id);
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
                    props.submission.problem_set.problems.map(problem =>
                        {
                            const answer = props.submission.answers.find(ans => ans.generated_problem_id === problem.id);

                            return (
                                <ListItem
                                    key={"problem_" + problem.id}
                                    >
                                    <SubmissionProblemView
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