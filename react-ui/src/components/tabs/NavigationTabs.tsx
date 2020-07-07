import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EditorTab from './EditorTab';
import { VersionService } from '../../services/VersionService';
import { FoldersService } from '../../services/FoldersService';
import { ProblemsService } from '../../services/ProblemsService';
import { ProblemSetService } from '../../services/ProblemSetService';
import GroupsTab from './GroupsTab';
import { PermissionsService } from '../../services/PermissionsService';
import { UserService } from '../../services/UserService';
import PermissionsTab from './PermissionsTab';
import TrainTab from './TrainTab';
import { ExaminationService } from '../../services/ExaminationService';
import ReportsTab from './ReportsTab';
import { GroupService } from '../../services/GroupService';
import { TabPanel } from '../common/TabPanel';
import { AdminService } from '../../services/AdminService';
import AdminTab from './AdminTab';

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
}

export default function NavigationTabs(props: INavigationTabsProps) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={(_, newValue) => handleChange(newValue)}
        >
          <Tab label="Train" />
          <Tab label="Reports" />
          {props.roles.includes("admin") ? <Tab label="Editor" /> : null}
          {props.roles.includes("admin") ? <Tab label="Groups" /> : null}
          {props.roles.includes("admin") ? <Tab label="Permissions" />: null}
          {props.roles.includes("superadmin") ? <Tab label="Admin" />: null}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TrainTab
          userService={props.userService}
          examinationService={props.examinationService}
          />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReportsTab
          examinationService={props.examinationService}
          userService={props.userService}
          />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <EditorTab
            versionService={props.versionService}
            permissionsService={props.permissionsService}
            foldersService={props.foldersService}
            problemsService={props.problemsService}
            problemSetService={props.problemSetService}
            userService={props.userService}
            />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GroupsTab
          groupService={props.groupService}
          userService={props.userService}
          />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <PermissionsTab
          permissionsService={props.permissionsService}
          examinationService={props.examinationService}
          groupService={props.groupService}
          userService={props.userService}
          versionService={props.versionService}
          foldersService={props.foldersService}
          problemsService={props.problemsService}
          problemSetService={props.problemSetService}
          />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <AdminTab
          adminService={props.adminService}
          />
      </TabPanel>
    </div>
  );
}
