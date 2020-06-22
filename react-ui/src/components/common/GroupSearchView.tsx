import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Group } from "../../models/Permissions";
import { GroupId } from "../../models/Identificators";
import { GroupService } from "../../services/GroupService";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: "100%",
    },
}));

interface IState {
    open: boolean;
    pattern: string;
    groups: Array<Group> | null;
}

export interface IGroupSearchViewProps {
    groupService: GroupService;
    onGroupSelected: (groupId: GroupId | null) => void;
}

export default function GroupSearchView(props: IGroupSearchViewProps) {

    const [ state, setState ] = React.useState<IState>({
        open: false,
        groups: null,
        pattern: ""
    });

    const loading = state.open && state.groups === null;

    useEffect(() => {
        let active = true;

        if (state.groups === null) {
            props.groupService
                .search(state.pattern, 0, 10)
                .then(groups => {
                    if (active) {
                        setState({
                            ...state,
                            groups: groups,
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
            groups: null,
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
            options={state.groups ? state.groups : []}
            loading={loading}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Group"
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