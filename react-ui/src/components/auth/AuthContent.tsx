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

export interface IAuthContentProps {
    authService: AuthService;
}

export default function AuthContent(props: IAuthContentProps) {

    const authService = props.authService;
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
        <Grid direction="row-reverse" className={classes.root} container spacing={2}>
            <Grid item hidden={user !== null} className={classes.cell}>
                <Button onClick={login} variant="contained" color="primary">
                    Login
                </Button>
            </Grid>
            <Grid item hidden={user === null} className={classes.cell}>
                <Button onClick={logout} variant="contained" color="primary">
                    Logout
                </Button>
            </Grid>
            <Grid item hidden={user === null} className={classes.cell}>
                <Typography variant="h6">
                    {name}
                </Typography>
            </Grid>
        </Grid>
    );
}