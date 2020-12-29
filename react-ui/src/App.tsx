import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import './App.css';
import { Toolbar, Typography, makeStyles, Grid, IconButton } from '@material-ui/core';
import NavigationTabs from './components/tabs/NavigationTabs';
import { User } from 'oidc-client';
import MenuIcon from '@material-ui/icons/Menu';
import AuthContainer from './components/auth/AuthContainer';
import { authService, userService } from './Services';

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
                            <AuthContainer />
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
