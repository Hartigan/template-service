import * as React from 'react'
import { User } from 'oidc-client';
import { Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { AuthService } from '../../services/AuthService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    cell: {
    }
}));

interface IState {
    user: User | null;
    name: string | null | undefined;
    isLoaded: boolean;
}

export interface IAuthContentProps {
    authService: AuthService;
}

export default function AuthContent(props: IAuthContentProps) {

    const authService = props.authService;

    const [ state, setState ] = React.useState<IState>({
        user: null,
        name: null,
        isLoaded: false
    });
  
    React.useEffect(() => {
        if (state.isLoaded) {
            return;
        }
        authService
            .getUser()
            .then(user => {
                setState({
                    user: user,
                    name: user?.profile.name,
                    isLoaded: true
                });
            });
    }); 

    const login = () => {
        authService.login();
    }

    const logout = () => {
        authService.logout();
    };

    const classes = useStyles();

    return (
        <Grid direction="row-reverse" className={classes.root} container spacing={2}>
            <Grid item hidden={state.user !== null} className={classes.cell}>
                <Button onClick={login} variant="contained" color="primary">
                    Login
                </Button>
            </Grid>
            <Grid item hidden={state.user === null} className={classes.cell}>
                <Button onClick={logout} variant="contained" color="primary">
                    Logout
                </Button>
            </Grid>
            <Grid item hidden={state.user === null} className={classes.cell}>
                <Typography variant="h6">
                    {state.name}
                </Typography>
            </Grid>
        </Grid>
    );
}