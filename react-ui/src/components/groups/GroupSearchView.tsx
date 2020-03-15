import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { PermissionsService } from "../../services/PermissionsService";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Group } from "../../models/Permissions";
import { GroupId } from "../../models/Identificators";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

interface IState {
    open: boolean;
    pattern: string;
    groups: Array<Group>;
    loaded: boolean;
}

export interface IGroupSearchViewProps {
    permissionsService: PermissionsService;
    onGroupSelected: (groupId: GroupId | null) => void;
}

export default function GroupSearchView(props: IGroupSearchViewProps) {

    const [ state, setState ] = React.useState<IState>({
        open: false,
        groups: [],
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
            props.permissionsService
                .searchByContains(state.pattern)
                .then(groups => {
                    if (active) {
                        setState({
                            ...state,
                            groups: groups,
                            loaded: true
                        });
                    }
                });
        }

        return () => {
            active = false;
        };
    });
    
    useEffect(() => {
        if (!state.open) {
            setState({
                ...state,
                groups: [],
                loaded: true
            });
        }
    }, [state.open]);

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
            groups: [],
            loaded: false
        });
    }

    return (
        <Autocomplete
            className={classes.root}
            open={state.open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={option => option.name}
            onChange={(event: any, value: Group | null) => props.onGroupSelected(value ? value.id : null)}
            options={state.groups}
            loading={loading}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Name"
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