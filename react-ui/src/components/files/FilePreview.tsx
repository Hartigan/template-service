import { makeStyles, Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { VersionService } from "../../services/VersionService";
import { HeadId } from "../../models/Identificators";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import ProblemEditor from "../problems/ProblemEditor";
import { Commit } from "../../models/Commit";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%"
    },
}));

export interface IFilePreviewProps {
    fileExplorerState: FileExplorerState;
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
                    <Box className={classes.root}>
                        <ProblemEditor
                            commit={commit}
                            fileExplorerState={props.fileExplorerState}
                            problemsService={props.problemsService} />
                    </Box>
                );
            case "problem_set":
                break;
        }
    }

    return (
        <Box className={classes.root}>
        </Box>
    );
};