import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import EditorTab from './EditorTab';
import { VersionService } from '../../services/VersionService';
import { FoldersService } from '../../services/FoldersService';
import { ProblemsService } from '../../services/ProblemsService';
import { ProblemSetService } from '../../services/ProblemSetService';
import GroupsTab from './GroupsTab';
import { PermissionsService } from '../../services/PermissionsService';
import { UserService } from '../../services/UserService';

interface ITabPanelProps {
    children: Array<React.ReactNode> | React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: ITabPanelProps) {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

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
    userService: UserService;
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
          <Tab label="Editor" />
          <Tab label="Groups" />
          <Tab label="Permissions" />
          <Tab label="Train" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <EditorTab
            versionService={props.versionService}
            foldersService={props.foldersService}
            problemsService={props.problemsService}
            problemSetService={props.problemSetService}
            />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GroupsTab
            permissionsService={props.permissionsService}
            userService={props.userService}
            />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Permissions
      </TabPanel>
      <TabPanel value={value} index={3}>
        Train
      </TabPanel>
    </div>
  );
}
