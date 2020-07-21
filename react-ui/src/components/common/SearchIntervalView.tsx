import { makeStyles, Slider, Switch, Container, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { SearchInterval } from "../../models/SearchInterval";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
    },
    slider: {
        minWidth: "200px"
    },
    toolbar: {
        flexGrow: 1,
        marginBottom: "32px",
        padding: 0
    },
    label: {
        flexGrow: 1,
        fontSize: 14,
    },

}));

interface IState {
    value: SearchInterval<number> | null;
    sub: NodeJS.Timeout | null;
}

export interface ISearchIntervalViewProps {
    label: string;
    interval: SearchInterval<number> | null;
    defaultInterval: SearchInterval<number>;
    maxInterval: SearchInterval<number>;
    onChanged: (interval: SearchInterval<number> | null) => void;
}

export default function SearchIntervalView(props: ISearchIntervalViewProps) {

    const [ state, setState ] = React.useState<IState>({
        sub: null,
        value: null
    });

    const classes = useStyles();

    const onChangeThrottled = (newValue: SearchInterval<number> | null) => {
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

    const handleChange = (event: any, newValue: number | number[]) => {
        const values = newValue as number[];
        onChangeThrottled({
            from: Math.min(...values),
            to: Math.max(...values)
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
            <Slider
                className={classes.slider}
                disabled={state.value === null}
                value={state.value ? [ state.value.from, state.value.to ] : []}
                onChange={handleChange}
                valueLabelDisplay="on"
                min={props.maxInterval.from}
                max={props.maxInterval.to}
                />
        </Container>
    );
};