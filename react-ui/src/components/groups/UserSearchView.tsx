import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService } from "../../services/PermissionsService";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import { UserId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

interface IState {
    open: boolean;
    pattern: string;
    users: Array<User>;
    loaded: boolean;
}

export interface IUserSearchViewProps {
    permissionsService: PermissionsService;
    userService: UserService;
    onUserSelected: (userId: UserId | null) => void;
}

export default function UserSearchView(props: IUserSearchViewProps) {

    const [ state, setState ] = React.useState<IState>({
        open: false,
        users: [],
        loaded: false,
        pattern: ""
    });

    const loading = state.open && !state.loaded;

    useEffect(() => {
        let active = true;

        if (!loading) {
            return;
        }
    
        if (state.pattern !== "") {
            props.userService
                .searchByContains(state.pattern)
                .then(users => {
                    if (active) {
                        setState({
                            ...state,
                            users: users,
                            loaded: true
                        });
                    }
                });
        }

        return () => {
            active = false;
        };
    });
    
    const classes = useStyles();

    const setOpen = (value: boolean) => {
        setState({
            ...state,
            open: value
        });
    }

    const changePattern = (value: string) =>{
        setState({
            ...state,
            pattern: value,
            users: [],
            loaded: false
        });
    }

    return (
        <Autocomplete
            className={classes.root}
            open={state.open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionSelected={(option, value) => option.username === value.username}
            getOptionLabel={option => option.username}
            onChange={(event: any, value: User | null) => props.onUserSelected(value ? value.id : null)}
            options={state.users}
            loading={loading}
            renderInput={params => (
                <TextField
                    {...params}
                    label="User"
                    fullWidth
                    variant="outlined"
                    value={state.pattern}
                    onChange={(e) => changePattern(e.target.value)}
                    InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
    );
};