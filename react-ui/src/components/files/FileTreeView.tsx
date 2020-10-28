import * as React from 'react';
import { makeStyles, Container, Toolbar, Tabs, Tab } from '@material-ui/core';
import ExplorerView from './ExplorerView';
import { TabPanel } from '../common/TabPanel';
import HeadSearchView from './HeadSearchView';
import { HeadLink, FolderLink } from '../../models/Folder';
import { Report } from '../../models/Report';
import ReportSearchView from './ReportSearchView';
import FilesToolbarContainer from './toolbar/FilesToolbarContainer';

const useStyles = makeStyles(theme => ({
    root: {
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

interface IState {
    selectedTab: number;
    selectedFolder: FolderLink | null;
    updatedFolder: FolderLink | null;
}

export interface IFileTreeViewProps {
    hideToolbar?: boolean;
    selected: HeadLink | null;
    onSelect: (head: HeadLink) => void;
    enableReports?: {
        selected: Report | null;
        onSelect: (report: Report) => void;
    };
}

export default function FileTreeView(props: IFileTreeViewProps) {

    const [ state, setState ] = React.useState<IState>({
        selectedTab: 0,
        selectedFolder: null,
        updatedFolder: null
    });

    const onSelectFolder = (folder: FolderLink) => {
        setState({
            ...state,
            selectedFolder: folder
        });
    };

    const onFolderUpdated = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                setState({
                    ...state,
                    updatedFolder: null
                });
                resolve();
            });
        });
    };

    const selectTab = (value: number) => {
        setState({
            ...state,
            selectedTab: value
        });
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Toolbar className={classes.tabs}>
                <Tabs
                    variant="fullWidth"
                    className={classes.tabs}
                    value={state.selectedTab}
                    onChange={(_, newValue) => selectTab(newValue)}>
                    <Tab className={classes.tab} label="My" />
                    <Tab className={classes.tab} label="All" />
                    {props.enableReports
                        ? <Tab className={classes.tab} label="Reports" />
                        : null}
                </Tabs>
            </Toolbar>
            <TabPanel
                value={state.selectedTab}
                index={0}>
                <Container hidden={props.hideToolbar}>
                    <FilesToolbarContainer />
                </Container>
                <ExplorerView
                    selectedFolder={state.selectedFolder}
                    onSelectFolder={onSelectFolder}
                    selectedHead={props.selected}
                    onSelectHead={props.onSelect}
                    onFolderUpdated={onFolderUpdated}
                    updatedFolder={state.updatedFolder}
                    />
            </TabPanel>
            <TabPanel
                value={state.selectedTab}
                index={1}>
                <HeadSearchView
                    selected={props.selected}
                    onSelect={props.onSelect}
                    />
            </TabPanel>
            {props.enableReports
                ? <TabPanel
                        value={state.selectedTab}
                        index={2}
                        >
                        <ReportSearchView
                            selected={props.enableReports.selected}
                            onSelect={props.enableReports.onSelect}
                            />
                    </TabPanel>
                : null}
        </div>
    );
}