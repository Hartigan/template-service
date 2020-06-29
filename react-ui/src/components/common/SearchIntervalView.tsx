import { makeStyles, Slider, Switch, Container } from "@material-ui/core";
import React from "react";
import { SearchInterval } from "../../models/SearchInterval";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        minWidth: "320px"
    },
}));

interface IState {
    value: SearchInterval<number> | null;
    sub: NodeJS.Timeout | null;
}

export interface ISearchIntervalViewProps {
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
            <Switch
                checked={state.value !== null}
                onChange={handleChangeSwitch}
                color="primary"
                />
            <Slider
                value={state.value ? [ state.value.from, state.value.to ] : []}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={props.maxInterval.from}
                max={props.maxInterval.to}
                />
        </Container>
    );
};