import { makeStyles, Switch, Container, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { SearchInterval } from "../../models/SearchInterval";
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
    },
    toolbar: {
        flexGrow: 1,
        padding: 0
    },
    label: {
        flexGrow: 1,
        fontSize: 14,
    },
    datePicker: {
        flexGrow: 1
    },
    datePickerParent: {
        width: "100%",
        display: "flex-inline"
    }
}));

interface IState {
    value: SearchInterval<Date> | null;
    sub: NodeJS.Timeout | null;
}

export interface ISearchDateIntervalViewProps {
    label: string;
    interval: SearchInterval<Date> | null;
    defaultInterval: SearchInterval<Date>;
    onChanged: (interval: SearchInterval<Date> | null) => void;
}

export default function SearchDateIntervalView(props: ISearchDateIntervalViewProps) {

    const [ state, setState ] = React.useState<IState>({
        sub: null,
        value: null
    });

    const classes = useStyles();

    const onChangeThrottled = (newValue: SearchInterval<Date> | null) => {
        if (state.sub) {
            clearTimeout(state.sub);
        }

        const sub = setTimeout(() => {
            props.onChanged(newValue);
        }, 1000);

        setState({
            ...state,
            sub: sub,
            value: newValue
        });
    }

    const handleChangeFrom = (newValue: Date | null) => {
        if (newValue === null || state.value === null) {
            return;
        }

        onChangeThrottled({
            ...state.value,
            from: newValue
        });
    };

    const handleChangeTo = (newValue: Date | null) => {
        if (newValue === null || state.value === null) {
            return;
        }

        onChangeThrottled({
            ...state.value,
            to: newValue
        });
    };

    const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeThrottled(event.target.checked ? props.defaultInterval : null);
    };

    return (
        <Container className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Typography className={classes.label} color="textSecondary">
                    {props.label}
                </Typography>
                <Switch
                    checked={state.value !== null}
                    onChange={handleChangeSwitch}
                    color="primary"
                    />
            </Toolbar>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className={classes.datePickerParent}>
                    <KeyboardDatePicker
                        className={classes.datePicker}
                        disableToolbar
                        disabled={state.value === null}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="From"
                        value={state.value?.from}
                        onChange={handleChangeFrom}
                        />
                    <KeyboardDatePicker
                        className={classes.datePicker}
                        disableToolbar
                        disabled={state.value === null}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="To"
                        value={state.value?.to}
                        onChange={handleChangeTo}
                        />
                </div>
            </MuiPickersUtilsProvider>
        </Container>
    );
};