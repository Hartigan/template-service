import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";

interface IntegerValidatorOptions {
    base: 2 | 4 | 8 | 10 | 16;
}

export interface IIntegerValidatorEditorProps {
    className?: string;
    value: string;
    onChange(value: string): void;
    disabled: boolean;
}

function checkOptions(value: string) {
    try {
        let obj = JSON.parse(value);
        if (obj.base && typeof(obj.base) === 'number') {
            return true;
        }

    } catch (e) {
        return false;
    }

    return false;
}

export default function IntegerValidatorEditor(props: IIntegerValidatorEditorProps) {

    if (!checkOptions(props.value)) {
        props.onChange(JSON.stringify({ base: 10 }));
        return <div />
    }

    console.log(props.value);

    const options = JSON.parse(props.value) as IntegerValidatorOptions;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(
            JSON.stringify({
                base: parseInt(event.target.value)
            })
        );
    };

    return (
        <div className={props.className}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Base</FormLabel>
                <RadioGroup value={options.base} onChange={handleChange}>
                    <FormControlLabel value={2} disabled={props.disabled} control={<Radio color="primary" />} label="2" />
                    <FormControlLabel value={4} disabled={props.disabled} control={<Radio color="primary" />} label="4" />
                    <FormControlLabel value={8} disabled={props.disabled} control={<Radio color="primary" />} label="8" />
                    <FormControlLabel value={10} disabled={props.disabled} control={<Radio color="primary" />} label="10" />
                    <FormControlLabel value={16} disabled={props.disabled} control={<Radio color="primary" />} label="16" />
                </RadioGroup>
            </FormControl>
        </div>
    );
};