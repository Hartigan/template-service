import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { VersionService } from '../../services/VersionService';
import { FoldersService } from '../../services/FoldersService';
import { ProblemsService } from '../../services/ProblemsService';
import { ProblemSetService } from '../../services/ProblemSetService';
import { PermissionsService } from '../../services/PermissionsService';
import { UserService } from '../../services/UserService';
import { ExaminationService } from '../../services/ExaminationService';
import { GroupService } from '../../services/GroupService';
import { TabPanel } from '../common/TabPanel';
import { AdminService } from '../../services/AdminService';
import { Drawer, ListItemText, List, ListItem } from '@material-ui/core';
import ReportsTabContainer from './reports/ReportsTabContainer';
import TrainTabContainer from './train/TrainTabContainer';
import EditorTabContainer from './editor/EditorTabContainer';
import PermissionsTabContainer from './permissions/PermissionsTabContainer';
import GroupsTabContainer from './groups/GroupsTabContainer';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export interface INavigationTabsProps {
    versionService: VersionService;
    foldersService: FoldersService;
    problemsService: ProblemsService;
    problemSetService: ProblemSetService;
    permissionsService: PermissionsService;
    groupService: GroupService;
    userService: UserService;
    examinationService: ExaminationService;
    adminService: AdminService;
    roles: Array<string>;
    drawlerIsOpened: boolean;
    closeDrawler: () => void;
}

export default function NavigationTabs(props: INavigationTabsProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    props.closeDrawler();
  };

  return (
    <div className={classes.root}>
      <Drawer
        anchor={"left"}
        open={props.drawlerIsOpened}
        onClose={() => props.closeDrawler()}>
        <List>
          <ListItem button onClick={() => handleChange(0)}>
            <ListItemText>Tests</ListItemText>
          </ListItem>
          <ListItem button onClick={() => handleChange(1)}>
            <ListItemText>Reports</ListItemText>
          </ListItem>
          {props.roles.includes("admin")
            ? <ListItem button onClick={() => handleChange(2)}>
                <ListItemText>Editor</ListItemText>
              </ListItem>
            : null}
          {props.roles.includes("admin")
            ? <ListItem button onClick={() => handleChange(3)}>
                <ListItemText>Groups</ListItemText>
              </ListItem>
            : null}
          {props.roles.includes("admin")
            ? <ListItem button onClick={() => handleChange(4)}>
                <ListItemText>Permissions</ListItemText>
              </ListItem>
            : null}
        </List>
      </Drawer>
      <TabPanel value={value} index={0}>
        <TrainTabContainer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReportsTabContainer />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EditorTabContainer />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GroupsTabContainer />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PermissionsTabContainer />
      </TabPanel>
    </div>
  );
}
