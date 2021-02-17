import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GroupId } from "../../models/Identificators";
import Services from "../../Services";
import { GroupModel } from "../../models/domain";
import { SearchRequest } from "../../protobuf/groups_pb";
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
    groups: Array<GroupModel> | null;
}

export interface IGroupSearchViewProps {
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

        if (state.groups === null && state.open) {
            const request = new SearchRequest();
            request.setPattern(toStringValue(state.pattern));
            request.setOffset(0);
            request.setLimit(10);
            Services.groupService
                .search(request)
                .then(reply => {
                    const error = reply.getError();

                    if (error) {
                        Services.logger.error(error.getDescription());
                    }

                    if (active) {
                        const groups = reply.getGroups()?.getGroupsList() ?? [];
                        setState({
                            ...state,
                            groups: groups.map(x => x.toObject()),
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
            onChange={(event: any, value: GroupModel | null) => props.onGroupSelected(value ? value.id : null)}
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