import * as React from 'react'
import { User } from 'oidc-client';
import { Button, makeStyles, Toolbar, Menu, MenuItem } from '@material-ui/core';
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
    anchorElement: null | HTMLElement;
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
        isLoaded: false,
        anchorElement: null
    });
  
    React.useEffect(() => {
        if (state.isLoaded) {
            return;
        }
        authService
            .getUser()
            .then(user => {
                setState({
                    ...state,
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

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setState({
            ...state,
            anchorElement: event.currentTarget
        });
    };

    const closeMenu = () => {
        setState({
            ...state,
            anchorElement: null
        });
    };

    const classes = useStyles();

    return (
        <Toolbar className={classes.root}>
            <Button
                hidden={state.user === null}
                className={classes.username}
                onClick={openMenu}
                color="inherit">
                {state.name ?? ""}
            </Button>
            <Menu
                anchorEl={state.anchorElement}
                keepMounted
                open={Boolean(state.anchorElement)}
                onClose={closeMenu}>
                <MenuItem onClick={logout}>
                    Logout
                </MenuItem>
            </Menu>
            {state.user === null 
                ? (
                    <Button onClick={login} color="inherit">
                        Login
                    </Button>
                ) : null}
        </Toolbar>
    );
}