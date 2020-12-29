import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem } from '@material-ui/core';
import ReportsTabContainer from './reports/ReportsTabContainer';
import TrainTabContainer from './train/TrainTabContainer';
import EditorTabContainer from './editor/EditorTabContainer';
import PermissionsTabContainer from './permissions/PermissionsTabContainer';
import GroupsTabContainer from './groups/GroupsTabContainer';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { openTrainTab } from './train/TrainTabSlice';
import { openEditorTab } from './editor/EditorTabSlice';
import { openGroupsTab } from './groups/GroupsTabSlice';
import { openPermissionsTab } from './permissions/PermissionsTabSlice';
import { openReportsTab } from './reports/ReportsTabSlice';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    idleLink: {
      fontWeight: 'normal',
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    activeLink: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    }
}));

export interface INavigationTabsProps {
    roles: Array<string>;
    drawlerIsOpened: boolean;
    closeDrawler: () => void;
}

enum MainRoutes {
  TRAIN = "/train",
  REPORTS = "/reports",
  EDITOR = "/editor",
  GROUPS = "/groups",
  PERMISSIONS = "/permissions",
}

export default function NavigationTabs(props: INavigationTabsProps) {
  const classes = useStyles();

  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <Router>
        <Drawer
          anchor={"left"}
          open={props.drawlerIsOpened}
          onClose={() => props.closeDrawler()}>
          <List>
            <ListItem>
              <NavLink
                to={MainRoutes.TRAIN}
                className={classes.idleLink}
                activeClassName={classes.activeLink}
                onClick={() => dispatch(openTrainTab())}>
                Tests
              </NavLink>
            </ListItem>
            <ListItem>
              <NavLink
                to={MainRoutes.REPORTS}
                className={classes.idleLink}
                activeClassName={classes.activeLink}
                onClick={() => dispatch(openReportsTab())}>
                Reports
              </NavLink>
            </ListItem>
            {props.roles.includes("admin")
              ? <ListItem>
                  <NavLink
                    to={MainRoutes.EDITOR}
                    className={classes.idleLink}
                    activeClassName={classes.activeLink}
                    onClick={() => dispatch(openEditorTab())}>
                    Editor
                  </NavLink>
                </ListItem>
              : null}
            {props.roles.includes("admin")
              ? <ListItem>
                  <NavLink
                    to={MainRoutes.GROUPS}
                    className={classes.idleLink}
                    activeClassName={classes.activeLink}
                    onClick={() => dispatch(openGroupsTab())}>
                    Groups
                  </NavLink>
                </ListItem>
              : null}
            {props.roles.includes("admin")
              ? <ListItem>
                  <NavLink
                    to={MainRoutes.PERMISSIONS}
                    className={classes.idleLink}
                    activeClassName={classes.activeLink}
                    onClick={() => dispatch(openPermissionsTab())}>
                    Permissions
                  </NavLink>
                </ListItem>
              : null}
          </List>
        </Drawer>
        <Switch>
          <Route path={MainRoutes.TRAIN}>
            <TrainTabContainer />
          </Route>
          <Route path={MainRoutes.REPORTS}>
            <ReportsTabContainer />
          </Route>
          <Route path={MainRoutes.EDITOR}>
            <EditorTabContainer />
          </Route>
          <Route path={MainRoutes.GROUPS}>
            <GroupsTabContainer />
          </Route>
          <Route path={MainRoutes.PERMISSIONS}>
            <PermissionsTabContainer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
