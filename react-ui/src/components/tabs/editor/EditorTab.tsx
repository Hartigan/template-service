import { makeStyles, Grid, Container, Tab, Tabs, Toolbar } from "@material-ui/core";
import React from "react";
import { useDispatch } from 'react-redux';
import EditorTabFilesTreeContainer from "../../files/tree/EditorTabFilesTreeContainer";
import { TabPanel } from "../../common/TabPanel";
import FilesToolbarContainer from "../../files/toolbar/FilesToolbarContainer";
import { EditorTabTabs, selectTab } from "./EditorTabSlice";
import EditorTabHeadSearchContainer from "../../files/heads/EditorTabHeadSearchContainer";
import EditorFilePreviewContainer from "../../files/preview/EditorFilePreviewContainer";

const treeWidth = 320;

const useStyles = makeStyles(theme => ({
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
    treeContent: {
        flexGrow: 1,
        maxWidth: 400,
        textAlign: 'left'
    },
    tabs: {
        flexGrow: 1,
        margin: "auto"
    },
    tab: {
        minWidth: "100px"
    }
}));

export interface IEditorTabProps {
    selected: EditorTabTabs;
}

export default function EditorTab(props: IEditorTabProps) {

    const dispatch = useDispatch();

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <div className={classes.treeContent}>
                    <Toolbar className={classes.tabs}>
                        <Tabs
                            variant="fullWidth"
                            className={classes.tabs}
                            value={props.selected}
                            onChange={(_, newValue) => dispatch(selectTab(newValue as EditorTabTabs))}>
                            <Tab className={classes.tab} label="My" />
                            <Tab className={classes.tab} label="All" />
                        </Tabs>
                    </Toolbar>
                    <TabPanel
                        value={props.selected}
                        index={EditorTabTabs.FileTree}>
                        <Container>
                            <FilesToolbarContainer />
                        </Container>
                        <EditorTabFilesTreeContainer />
                    </TabPanel>
                    <TabPanel
                        value={props.selected}
                        index={EditorTabTabs.HeadSearch}>
                        <EditorTabHeadSearchContainer />
                    </TabPanel>
                </div>
            </Grid>
            <Grid item className={classes.content}>
                <EditorFilePreviewContainer />
            </Grid>
        </Grid>
    );
};