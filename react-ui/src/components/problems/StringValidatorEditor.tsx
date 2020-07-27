import React from "react";
import { FormLabel, FormControl, FormGroup, FormControlLabel, Switch } from "@material-ui/core";

interface StringValidatorOptions {
    ignore_case: boolean;
    trim: boolean;
}

export interface IStringValidatorEditorProps {
    className?: string;
    value: string;
    onChange(value: string): void;
    disabled: boolean;
}

function checkOptions(value: string) {
    try {
        let obj = JSON.parse(value);
        if (typeof(obj.ignore_case) === 'boolean' && typeof(obj.trim) === 'boolean') {
            return true;
        }

    } catch (e) {
        return false;
    }

    return false;
}

export default function StringValidatorEditor(props: IStringValidatorEditorProps) {

    if (!checkOptions(props.value)) {
        props.onChange(JSON.stringify({ trim: true, ignore_case: false }));
        return <div />
    }

    const options = JSON.parse(props.value) as StringValidatorOptions;

    const handleChangeTrim = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(
            JSON.stringify({
                ...options,
                trim: event.target.checked
            })
        );
    };

    const handleChangeIgnoreCase = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(
            JSON.stringify({
                ...options,
                ignore_case: event.target.checked
            })
        );
    };

    return (
        <div className={props.className}>
            <FormControl component="fieldset">
                <FormLabel component="legend">String validator options</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={options.trim} disabled={props.disabled} color="primary" onChange={handleChangeTrim} />}
                        label="Trim"
                        />
                    <FormControlLabel
                        control={<Switch checked={options.ignore_case} disabled={props.disabled} color="primary" onChange={handleChangeIgnoreCase} />}
                        label="Ignore case"
                        />
                </FormGroup>
            </FormControl>
        </div>
    );
};