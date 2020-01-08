import { makeStyles, Box, List, ListItem, Container, IconButton, Typography, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { ProblemsService } from "../../services/ProblemsService";
import { Commit } from "../../models/Commit";
import { FileExplorerState } from "../../states/FileExplorerState";
import EditIcon from '@material-ui/icons/Edit';
import { ProblemSetService } from "../../services/ProblemSetService";
import { ProblemSet } from "../../models/ProblemSet";
import { CommitId, ProblemSetId } from "../../models/Identificators";
import { HeadLink } from "../../models/Folder";
import { Problem } from "../../models/Problem";
import { VersionService } from "../../services/VersionService";
import ProblemsListView from "./ProblemsListView";
import ProblemPreview from "./ProblemPreview";
import { Head } from "../../models/Head";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%"
    },
    fieldTitle: {
        fontSize: 14,
      },
    list: {
        width: "100%",
    },
    listContainer: {
        width: "100%",
        height: "100%",
    },
    problemsList: {
        width: "30%",
    },
    listPreview: {
        width: "70%",
    },
}));

interface IPreviewData {
    problemSet: ProblemSet;
    problems: Array<HeadLink>;
    selectedProblem: Problem | null;
}

export interface IProblemSetPreviewProps {
    commit: Commit;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    versionService: VersionService;
    fileExplorerState: FileExplorerState;
}

export default function ProblemSetPreview(props: IProblemSetPreviewProps) {

    const [ data, setData ] = React.useState<IPreviewData | null>(null);

    const sync = async (commit: Commit) => {
        const problemId : ProblemSetId = commit.target.id;
        if (data && data.problemSet.id === problemId) {
            return;
        }
        const problemSet = await props.problemSetService.get(commit.id);
        const heads = await Promise.all(problemSet.head_ids.map(headId => props.versionService.getHead(headId)));
        const headLinks = heads.map(head => {
            return {
                id: head.id,
                name: head.name,
                type: head.commit.target.type,
            } as HeadLink;
        });

        setData({
            problemSet: problemSet,
            problems: headLinks,
            selectedProblem: null,
        });
    };

    useEffect(() => {
        sync(props.commit);
    });

    const onEdit = () => { 

    };

    const onSelectInList = async (index: number) => {
        if (!data) {
            return;
        }

        const link = data.problems[index];
        const head = await props.versionService.getHead(link.id);
        const problem = await props.problemsService.get(head.commit.id);
        setData({
            problemSet: data.problemSet,
            problems: data.problems,
            selectedProblem: problem,
        });
    };

    const classes = useStyles();

    const titleView = data ? (
        <ListItem key="title">
            <Box>
                <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                    Title
                </Typography>
                <Typography variant="h5" component="h2">
                    {data.problemSet.title}
                </Typography>
            </Box>
            
        </ListItem>
    ) : null;

    const durationView = data ? (
        <ListItem key="duration">
            <Box>
                <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                    Diration
                </Typography>
                <Typography variant="h5" component="h2">
                    {data.problemSet.duration / 60} min
                </Typography>
            </Box>
        </ListItem>
    ) : null;

    const problemsView = data ? (
        <ProblemsListView
            links={data.problems} 
            onSelect={(index) => onSelectInList(index)} />
    ) : null;

    const listPreview = (data && data.selectedProblem) ? (
        <ProblemPreview
            problem={data.selectedProblem} />
    ) : null;

    return (
        <Box className={classes.root}>
            <Container>
                <IconButton
                    onClick={onEdit}
                    color="primary"
                    aria-label="Edit">
                    <EditIcon />
                </IconButton>
            </Container>
            <List
                className={classes.list}>
                <ListItem key="desc">
                    <Box>
                        <Typography className={classes.fieldTitle} color="textSecondary" gutterBottom>
                            Commit description
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {props.commit.description}
                        </Typography>
                    </Box>
                </ListItem>
                {titleView}
                {durationView}
                <Grid container className={classes.listContainer}>
                    <Grid item className={classes.problemsList}>
                        {problemsView}
                    </Grid>
                    <Grid item className={classes.listPreview}>
                        {listPreview}
                    </Grid>
                </Grid>
            </List>
        </Box>
    );
};