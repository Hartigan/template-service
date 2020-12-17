import { makeStyles, Grid, Tab, Tabs, Toolbar } from "@material-ui/core";
import React from "react";
import { useDispatch } from 'react-redux';
import { TabPanel } from "../../common/TabPanel";
import PermissionsTabHeadSearchContainer from "../../files/heads/PermissionsTabHeadSearchContainer";
import ReportSearchContainer from "../../files/reports/ReportSearchContainer";
import PermissionsTabFilesTreeContainer from "../../files/tree/PermissionsTabFilesTreeContainer";
import PermissionsViewContainer from "../../groups/view/PermissionsViewContainer";
import { PermissionsTabTabs, selectTab } from "./PermissionsTabSlice";

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

export interface IPermissionsTabProps {
    selected: PermissionsTabTabs;
};

export default function PermissionsTab(props: IPermissionsTabProps) {

    const classes = useStyles();

    const dispatch = useDispatch();

    return (
        <Grid container className={classes.root}>
            <Grid item className={classes.tree}>
                <div className={classes.treeContent}>
                    <Toolbar className={classes.tabs}>
                        <Tabs
                            variant="fullWidth"
                            className={classes.tabs}
                            value={props.selected}
                            onChange={(_, newValue) => dispatch(selectTab(newValue as PermissionsTabTabs))}>
                            <Tab className={classes.tab} label="My" />
                            <Tab className={classes.tab} label="All" />
                        </Tabs>
                    </Toolbar>
                    <TabPanel
                        value={props.selected}
                        index={PermissionsTabTabs.FileTree}>
                        <PermissionsTabFilesTreeContainer />
                    </TabPanel>
                    <TabPanel
                        value={props.selected}
                        index={PermissionsTabTabs.HeadSearch}>
                        <PermissionsTabHeadSearchContainer />
                    </TabPanel>
                    <TabPanel
                        value={props.selected}
                        index={PermissionsTabTabs.ReportSearch}>
                        <ReportSearchContainer />
                    </TabPanel>
                </div>
            </Grid>
            <Grid item className={classes.content}>
                <PermissionsViewContainer />
            </Grid>
        </Grid>
    );
};