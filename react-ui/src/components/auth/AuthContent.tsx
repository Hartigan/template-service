import * as React from 'react'
import { User } from 'oidc-client';
import { Typography, Button, makeStyles, Toolbar } from '@material-ui/core';
import { AuthService } from '../../services/AuthService';

const useStyles = makeStyles(theme => ({
    root: {
    },
    username: {
        marginRight: "12px"
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
        <Toolbar className={classes.root}>
            <Typography hidden={state.user === null} variant="h6" className={classes.username}>
                {state.name}
            </Typography>
            {state.user
                ? (
                    <Button onClick={logout} color="inherit">
                        Logout
                    </Button>
                )
                : (
                    <Button onClick={login} color="inherit">
                        Login
                    </Button>
                )}
        </Toolbar>
    );
}