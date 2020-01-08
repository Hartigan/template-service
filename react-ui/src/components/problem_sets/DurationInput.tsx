import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
  },
  input: {
    width: 42,
  },
});

export interface IDurationInputProps {
    onChange(mins: number): void;
    value: number;
    step: number;
    max: number;
}

export default function DurationInput(props: IDurationInputProps) {
    const classes = useStyles();

    const setCurrent = (value: number) => {
        if (value < 0) {
            props.onChange(0);
        } else if (value > props.max) {
            props.onChange(props.max);
        } else {
            props.onChange(value);
        }
    }

    const onSliderChange = (value: number | number[]) => {
        if (typeof value === 'number') {
            setCurrent(value as number);
        }
    };

    const onInputChange = (value: string) => {
        setCurrent(value === '' ? 0 : Number(value));
    };

  return (
    <Box className={classes.root}>
        <Typography id="input-slider" gutterBottom>
            Duration
        </Typography>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs>
                <Slider
                    value={props.value}
                    onChange={(_, v) => onSliderChange(v)}
                    min={0}
                    max={props.max}
                    step={props.step}
                    aria-labelledby="input-slider"
                />
            </Grid>
            <Grid item>
                <Input
                    className={classes.input}
                    value={props.value}
                    margin="dense"
                    onChange={e => onInputChange(e.target.value)}
                    inputProps={{
                        step: props.step,
                        min: 0,
                        max: props.max,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }} />
            </Grid>
        </Grid>
    </Box>
  );
}