import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import AuthContent from './components/auth/AuthContent'
import './App.css';
import { Toolbar, Typography, makeStyles, Grid } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
    offset: theme.mixins.toolbar,
    main: {
        width: "100%",
        height: "100%",
    },
    contentCell: {
        marginTop: 64,
        width: "100%",
        height: "100%",
    },
    title: {
        align: "left",
        minWidth: 200,
        flexGrow: 1,
    },
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

interface IState {
    isLoaded: boolean;
    user: User | null;
}

const App: React.FC = () => {
    const [ state, setState ] = React.useState<IState>({
        isLoaded: false,
        user: null
    })

    const classes = useStyles();

    useEffect(() => {
        if (state.isLoaded) {
            return;
        }

        authService.getUser().then(user => {
            setState({
                ...state,
                isLoaded: true,
                user: user
            })
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
            return (
                <NavigationTabs
                    versionService={versionService}
                    foldersService={foldersService}
                    problemsService={problemsService}
                    problemSetService={problemSetService}
                    permissionsService={permissionsService}
                    userService={userService}
                    examinationService={examinationService}
                    groupService={groupService}
                    isAdmin={state.user.profile.role === "admin"}
                    />
            );
        }
    }

    return (
        <div className="App">
            <Grid container className={classes.main}>
                <Grid item>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6" noWrap={true} className={classes.title}>
                                Testing service
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
