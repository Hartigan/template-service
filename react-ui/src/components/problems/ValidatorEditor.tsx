import { Validator } from "../../models/Validator";
import CodeEditor from "./CodeEditor";
import React from "react";
import { CodeLanguage } from "../../models/Code";

export interface IValidatorEditorProps {
    value: Validator;
    onChange(value: Validator): void;
    disabled: boolean;
}

export default function ValidatorEditor(props: IValidatorEditorProps) {

    const languages = [
        { value: CodeLanguage.CSharp, title: "C#"}
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