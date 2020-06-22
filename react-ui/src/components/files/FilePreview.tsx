import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { VersionService } from "../../services/VersionService";
import { HeadId } from "../../models/Identificators";
import { FileExplorerState } from "../../states/FileExplorerState";
import { ProblemsService } from "../../services/ProblemsService";
import ProblemEditor from "../problems/ProblemEditor";
import ProblemSetPreview from "../problem_sets/ProblemSetPreview";
import { ProblemSetService } from "../../services/ProblemSetService";
import { FoldersService } from "../../services/FoldersService";
import { Head } from "../../models/Head";
import TagsEditorView from "../utils/TagsEditorView";
import { PermissionsService } from "../../services/PermissionsService";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

interface IState {
    head: Head | null;
}

export interface IFilePreviewProps {
    fileExplorerState: FileExplorerState;
    problemSetService: ProblemSetService;
    foldersService: FoldersService;
    versionService: VersionService;
    problemsService: ProblemsService;
    permissionsService: PermissionsService;
}

export default function FilePreview(props: IFilePreviewProps) {

    const [ state, setState ] = React.useState<IState>({
        head: null
    });

    const sync = async (id: HeadId) => {
        let head = await props.versionService.getHead(id);
        setState({
            ...state,
            head: head
        });
    }

    useEffect(() => {
        const onChangedSub = props.fileExplorerState
            .currentHeadChanged()
            .subscribe(async headLink => {
                if (!headLink) {
                    return;
                }

                if (state.head && state.head.id === headLink.id) {
                    return;
                }

                await sync(headLink.id);
            });

        const onUpdatedSub = props.fileExplorerState
            .headUpdated()
            .subscribe(async id => {
                await sync(id);
            });

        return () => {
            onChangedSub.unsubscribe();
            onUpdatedSub.unsubscribe();
        };
    })

    const classes = useStyles();

    const getHeadView = () => {
        if (state.head) {
            switch (state.head.commit.target.type) {
                case "problem":
                    return (
                        <ProblemEditor
                            commit={state.head.commit}
                            fileExplorerState={props.fileExplorerState}
                            permissionsService={props.permissionsService}
                            problemsService={props.problemsService} />
                    );
                case "problem_set":
                    return (
                        <ProblemSetPreview
                            commit={state.head.commit}
                            fileExplorerState={props.fileExplorerState}
                            versionService={props.versionService}
                            foldersService={props.foldersService}
                            problemSetService={props.problemSetService}
                            permissionsService={props.permissionsService}
                            problemsService={props.problemsService} />
                    );
            }
        }
    };

    const getTagsEditor = () => {
        if (state.head) {
            const onRemove = async (tag: string) => {
                if (state.head === null) {
                    return;
                }
                await props.versionService.updateTags(state.head.id, state.head.tags.filter(x => x !== tag))
                await sync(state.head.id);
            };

            const onAdd = async (tag: string) => {
                if (state.head === null || !tag) {
                    return;
                }
                const tags = [ ...state.head.tags, tag ];
                await props.versionService.updateTags(state.head.id, tags);
                await sync(state.head.id);
            };

            return (
                <TagsEditorView
                    tags={state.head.tags}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    />
            );
        }
        else {
            return (
                <div/>
            )
        }
    };

    return (
        <Paper className={classes.root}>
            {getTagsEditor()}
            {getHeadView()}
        </Paper>
    );
};