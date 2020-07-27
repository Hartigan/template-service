import React from "react";
import { TextField } from "@material-ui/core";

interface FloatValidatorOptions {
    epsilon: number;
}

export interface IFloatValidatorEditorProps {
    className?: string;
    value: string;
    onChange(value: string): void;
    disabled: boolean;
}

function checkOptions(value: string) {
    try {
        let obj = JSON.parse(value);
        if (obj.epsilon && typeof(obj.epsilon) === 'number') {
            return true;
        }

    } catch (e) {
        return false;
    }

    return false;
}

export default function FloatValidatorEditor(props: IFloatValidatorEditorProps) {

    if (!checkOptions(props.value)) {
        props.onChange(JSON.stringify({ epsilon: 0.001 }));
        return <div />
    }

    const options = JSON.parse(props.value) as FloatValidatorOptions;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(
            JSON.stringify({
                epsilon: parseFloat(event.target.value)
            })
        );
    };

    return (
        <div className={props.className}>
            <TextField
                label="Epsilon"
                type="number"
                value={options.epsilon}
                disabled={props.disabled}
                onChange={handleChange}
                />
        </div>
    );
};