import { makeStyles } from "@material-ui/core";
import { Validator } from "../../models/Validator";
import CodeEditor from "./CodeEditor";
import React from "react";

export interface IValidatorEditorProps {
    value: Validator;
    onChange(value: Validator): void;
    disabled: boolean;
}

export default function ValidatorEditor(props: IValidatorEditorProps) {

    const languages = [
        { value: "csharp", title: "C#"}
    ];

    return (
        <CodeEditor
            value={props.value}
            label="Validator"
            languages={languages}
            onChange={props.onChange}
            disabled={props.disabled} />
    );
};