import { makeStyles, Box, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { VersionService } from "../../services/VersionService";
import { HeadId } from "../../models/Identificators";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import ProblemEditor from "../problems/ProblemEditor";
import { Commit } from "../../models/Commit";
import ProblemSetPreview from "../problem_sets/ProblemSetPreview";
import { ProblemSetService } from "../../services/ProblemSetService";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

export interface IFilePreviewProps {
    fileExplorerState: FileExplorerState;
    problemSetService: ProblemSetService;
    versionService: VersionService;
    problemsService: ProblemsService;
}

export default function FilePreview(props: IFilePreviewProps) {

    const [ headId, setHeadId ] = React.useState<HeadId | null>(null);
    const [ commit, setCommit ] = React.useState<Commit | null>(null);

    const sync = async (id: HeadId) => {
        if (!id) {
            return;
        }

        let head = await props.versionService.getHead(id);
        setHeadId(id);
        setCommit(head.commit);
    }

    useEffect(() => {
        const onChangedSub = props.fileExplorerState
            .currentHeadChanged()
            .subscribe(async headLink => {
                if (!headLink || headLink.id === headId) {
                    return;
                }
                await sync(headLink.id);
            });

        const onUpdatedSub = props.fileExplorerState
            .headUpdated()
            .subscribe(async id => {
                if (id !== headId) {
                    return;
                }
                await sync(id);
            });

        return () => {
            onChangedSub.unsubscribe();
            onUpdatedSub.unsubscribe();
        };
    })

    const classes = useStyles();

    if (commit) {
        switch (commit.target.type) {
            case "problem":
                return (
                    <Paper className={classes.root}>
                        <ProblemEditor
                            commit={commit}
                            fileExplorerState={props.fileExplorerState}
                            problemsService={props.problemsService} />
                    </Paper>
                );
            case "problem_set":
                return (
                    <Paper className={classes.root}>
                        <ProblemSetPreview
                            commit={commit}
                            fileExplorerState={props.fileExplorerState}
                            versionService={props.versionService}
                            problemSetService={props.problemSetService}
                            problemsService={props.problemsService} />
                    </Paper>
                );
        }
    }

    return (
        <Paper className={classes.root}>
        </Paper>
    );
};