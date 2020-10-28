import { makeStyles, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService } from "../../services/PermissionsService";
import { UserService } from "../../services/UserService";
import { FoldersService } from "../../services/FoldersService";
import PermissionsView, { ProtectedItem } from "../groups/PermissionsView";
import { VersionService } from "../../services/VersionService";
import { GroupService } from "../../services/GroupService";
import { ProblemsService } from "../../services/ProblemsService";
import FileTreeViewDeprecated from "../files/FileTreeViewDeprecated";
import { ProblemSetService } from "../../services/ProblemSetService";
import { HeadLink } from "../../models/Folder";
import { ExaminationService } from "../../services/ExaminationService";
import { Report } from "../../models/Report";

const treeWidth = 360;

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        height: "100%",
    },
    tree: {
        width: `${treeWidth}px`,
        height: "100%",
    },
    content: {
        width: `calc(100% - ${treeWidth}px)`,
        height: "100%",
    },
}));

interface IState {
    head: HeadLink | null;
    report: Report | null;
    item: ProtectedItem | null;
    title: string;
}

export interface IPermissionsTabProps {
    permissionsService: PermissionsService;
    examinationService: ExaminationService;
    userService: UserService;
    versionService: VersionService;
    foldersService: FoldersService;
    groupService: GroupService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
}

export default function PermissionsTab(props: IPermissionsTabProps) {

    const [ state, setState ] = React.useState<IState>({
        head: null,
        report: null,
        item: null,
        title: ""
    });

    const changeCurrentHead = (current: HeadLink | null) => {
        setState({
            ...state,
            head: current,
            item: current ? { id: current.id, type: current.type } : null,
            title: current ? current.name : ""
        });
    };

    const changeCurrentReport = (current: Report | null) => {
        setState({
            ...state,
            report: current,
            item: current ? { id: current.id, type: "report" } : null,
            title: current ? current.problem_set.title : ""
        });
    };

    useEffect(() => {
        return () => {
        }
    });

    const classes = useStyles();

    const permissionsView = state.item ? (
        <PermissionsView
            userService={props.userService}
            groupService={props.groupService}
            permissionsService={props.permissionsService}
            protectedItem={state.item}
            title={state.title}
            />
    ) : null;

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <FileTreeViewDeprecated
                    hideToolbar={true}
                    selected={state.head}
                    onSelect={changeCurrentHead}
                    enableReports={{
                        selected: state.report,
                        onSelect: changeCurrentReport
                    }}/>
            </Grid>
            <Grid item className={classes.content}>
                {permissionsView}
            </Grid>
        </Grid>
    );
};