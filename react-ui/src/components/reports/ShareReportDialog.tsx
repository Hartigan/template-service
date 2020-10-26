import { makeStyles, Dialog, DialogTitle, Button, Container } from "@material-ui/core";
import React from "react";
import UserSearchView from "../common/UserSearchView";
import { ReportId, UserId } from "../../models/Identificators";
import { examinationService } from "../../Services";

const useStyles = makeStyles({
    root: {
        padding: "10px"
    },
});

interface IState {
    userId: UserId | null;
}

export interface IShareReportDialogProps {
    open: boolean;
    onClose: () => void;
    reportId: ReportId;
}

export default function ShareReportDialog(props: IShareReportDialogProps) {

    const [ state, setState ] = React.useState<IState>({
        userId: null
    });

    const onCancel = () => {
        props.onClose();
    };

    const onShare = async () => {
        if (state.userId) {
            await examinationService.shareReport(props.reportId, [ state.userId ], []);
            props.onClose();
        }
    };

    const classes = useStyles();

    return (
        <Dialog
            aria-labelledby="dialog-title"
            className={classes.root}
            open={props.open}>
            <DialogTitle id="dialog-title">Share report</DialogTitle>
            <UserSearchView
                onUserSelected={(userId) => setState({ ...state, userId: userId})}
                />
            <Container>
                <Button variant="contained" onClick={onCancel}>Cancel</Button>
                <Button variant="contained" onClick={onShare}>Share</Button>
            </Container>
        </Dialog>
    );
}