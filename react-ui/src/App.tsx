import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import AuthContent from './components/auth/AuthContent'
import './App.css';
import { Toolbar, Typography, makeStyles, Grid, IconButton } from '@material-ui/core';
import { AuthService } from './services/AuthService';
import { HttpServiceFactory } from './services/HttpServiceFactory';
import { FoldersService } from './services/FoldersService';
import { ProblemsService } from './services/ProblemsService';
import { VersionService } from './services/VersionService';
import { ProblemSetService } from './services/ProblemSetService';
import NavigationTabs from './components/tabs/NavigationTabs';
import { PermissionsService } from './services/PermissionsService';
import { UserService } from './services/UserService';
import { ExaminationService } from './services/ExaminationService';
import { User } from 'oidc-client';
import { GroupService } from './services/GroupService';
import { AdminService } from './services/AdminService';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
    offset: theme.mixins.toolbar,
    main: {
        width: "100%",
        height: "100%",
    },
    appBarCell: {
        flexGrow: 1,
    },
    contentCell: {
        marginTop: 64,
        width: "100%",
        height: "100%",
    },
    title: {
        flexGrow: 1,
        overflow: "visible",
    },
    menuButton: {
        color: "white"
    }
}));

const authService = new AuthService();
const httpServiceFactory = new HttpServiceFactory(authService);
const versionService = new VersionService(httpServiceFactory);
const foldersService = new FoldersService(httpServiceFactory);
const problemsService = new ProblemsService(httpServiceFactory);
const problemSetService = new ProblemSetService(httpServiceFactory);
const permissionsService = new PermissionsService(httpServiceFactory);
const userService = new UserService(httpServiceFactory);
const examinationService = new ExaminationService(httpServiceFactory);
const groupService = new GroupService(httpServiceFactory);
const adminService = new AdminService(httpServiceFactory);

interface IState {
    isLoaded: boolean;
    user: User | null;
    drawlerOpened: boolean;
}

const App: React.FC = () => {
    const [ state, setState ] = React.useState<IState>({
        isLoaded: false,
        user: null,
        drawlerOpened: false
    });

    const classes = useStyles();

    const changeDrawlerState = (value: boolean) => {
        setState({
            ...state,
            drawlerOpened: value
        });
    };

    useEffect(() => {
        if (state.isLoaded) {
            return;
        }

        authService.getUser().then(user => {
            if (user) {
                userService.init();
            }
            setState({
                ...state,
                isLoaded: true,
                user: user
            });
        });
    });



    const getMainView = () => {
        if (state.user === null) {
            return (
                <div />
            );
        }
        else {
            console.log(state.user.profile.role);
            const roles : Array<string> = [];

            if (Array.isArray(state.user.profile.role)) {
                roles.push(...(state.user.profile.role as Array<string>));
            }
            else if (state.user.profile.role) {
                roles.push(state.user.profile.role as string);
            }

            return (
                <NavigationTabs
                    drawlerIsOpened={state.drawlerOpened}
                    closeDrawler={() => changeDrawlerState(false)}
                    adminService={adminService}
                    versionService={versionService}
                    foldersService={foldersService}
                    problemsService={problemsService}
                    problemSetService={problemSetService}
                    permissionsService={permissionsService}
                    userService={userService}
                    examinationService={examinationService}
                    groupService={groupService}
                    roles={roles}
                    />
            );
        }
    }

    return (
        <div className="App">
            <Grid container className={classes.main}>
                <Grid item className={classes.appBarCell}>
                    <AppBar>
                        <Toolbar>
                            {state.user
                                ? (
                                    <IconButton
                                        className={classes.menuButton}
                                        onClick={() => changeDrawlerState(true)}>
                                        <MenuIcon />
                                    </IconButton>
                                ) : null}
                            <Typography variant="h6" noWrap={true} className={classes.title}>
                                Quiz generator
                            </Typography>
                            <AuthContent authService={authService} />
                        </Toolbar>
                    </AppBar>
                </Grid>
                <Grid item className={classes.contentCell}>
                    {getMainView()}
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
