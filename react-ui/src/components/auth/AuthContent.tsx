import * as React from 'react'
import { User } from 'oidc-client';
import { Typography, Button, Grid, makeStyles } from '@material-ui/core';
import { AuthService } from '../../services/AuthService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
}));

export default function AuthContent() {

    const authService = new AuthService();
    const [ user, setUser ] = React.useState<User | null>(null);
    const [ name, setName ] = React.useState<string | null | undefined>(null);
    const [ isLoaded, setIsLoaded ] = React.useState<boolean>(false);
  
    React.useEffect(() => {
        if (!isLoaded) {
            setIsLoaded(true);
            authService.getUser().then(user => {
                if (user) {
                    setUser(user);
                    if (user.profile) {
                        setName(user.profile.name);
                    }
                }
            });
        }
    }); 

    const login = () => {
        authService.login();
    }

    const logout = () => {
        authService.logout();
    };

    const classes = useStyles();

    return (
        <Grid direction="row-reverse" className={classes.root} container>
            <Grid item hidden={user !== null}>
                <Button onClick={login}>
                    Login
                </Button>
            </Grid>
            <Grid hidden={user === null}>
                <Button onClick={logout}>
                    Logout
                </Button>
            </Grid>
            <Grid item hidden={user === null}>
                <Typography variant="h6">
                    {name}
                </Typography>
            </Grid>
        </Grid>
    );
}