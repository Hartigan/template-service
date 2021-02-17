import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserId } from "../../models/Identificators";
import Services from "../../Services";
import { UserModel } from "../../models/domain";
import { SearchRequest } from "../../protobuf/users_pb";
import { toStringValue } from "../utils/Utils";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

interface IState {
    open: boolean;
    pattern: string;
    users: Array<UserModel> | null;
}

export interface IUserSearchViewProps {
    onUserSelected: (userId: UserId | null) => void;
}

export default function UserSearchView(props: IUserSearchViewProps) {

    const [ state, setState ] = React.useState<IState>({
        open: false,
        users: null,
        pattern: ""
    });

    const loading = state.open && state.users === null;

    useEffect(() => {
        let active = true;

        if (state.users === null && state.open) {
            const request = new SearchRequest();
            request.setPattern(toStringValue(state.pattern));
            request.setOffset(0);
            request.setLimit(10);
            Services.userService
                .search(request)
                .then(reply => {
                    const error = reply.getError();

                    if (error) {
                        Services.logger.error(error.getDescription());
                    }

                    if (active) {
                        const users = reply.getUsers()?.getUsersList() ?? [];
                        setState({
                            ...state,
                            users: users.map(x => x.toObject()),
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
            users: null,
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
            onChange={(event: any, value: UserModel | null) => props.onUserSelected(value ? value.id : null)}
            options={state.users === null ? [] : state.users}
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