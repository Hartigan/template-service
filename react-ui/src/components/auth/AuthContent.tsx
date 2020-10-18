import * as React from 'react'
import { Button, makeStyles, Toolbar, Menu, MenuItem } from '@material-ui/core';
import { useDispatch } from 'react-redux'
import { authService } from '../../Services';
import { fetchUser } from '../../store/auth/AuthContentSlice';

const useStyles = makeStyles(theme => ({
    root: {
    },
    username: {
        marginRight: "12px"
    }
}));

interface IState {
    anchorElement: null | HTMLElement;
}
export interface IAuthContentProps {
    name: string | null ;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null
}

export default function AuthContent(props: IAuthContentProps) {
    const dispatch = useDispatch();

    const [ state, setState ] = React.useState<IState>({
        anchorElement: null
    });
    React.useEffect(() => {
        if (props.loading === 'idle') {
            dispatch(fetchUser());
        }
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
                hidden={props.name === null}
                className={classes.username}
                onClick={openMenu}
                color="inherit">
                {props.name ?? ""}
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
            {props.name === null 
                ? (
                    <Button onClick={login} color="inherit">
                        Login
                    </Button>
                ) : null}
        </Toolbar>
    );
}