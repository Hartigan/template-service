import { Validator } from "../../models/Validator";
import CodeEditor from "./CodeEditor";
import React from "react";
import { ValidatorLanguage } from "../../models/Code";

export interface IValidatorEditorProps {
    value: Validator;
    onChange(value: Validator): void;
    disabled: boolean;
}

export default function ValidatorEditor(props: IValidatorEditorProps) {

    const languages = [
        { value: ValidatorLanguage.CSharp, title: "C#"},
        { value: ValidatorLanguage.IntegerValidator, title: "Integer validator"},
        { value: ValidatorLanguage.FloatValidator, title: "Float validator"},
        { value: ValidatorLanguage.StringValidator, title: "String validator"}
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