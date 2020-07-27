import { Controller } from "../../models/Controller";
import CodeEditor from "./CodeEditor";
import React from "react";
import { ControllerLanguage } from "../../models/Code";

export interface IControllerEditorProps {
    value: Controller;
    onChange(value: Controller): void;
    disabled: boolean;
}

export default function ControllerEditor(props: IControllerEditorProps) {

    const languages = [
        { value: ControllerLanguage.CSharp, title: "C#"}
    ];

    return (
        <CodeEditor
            value={props.value}
            label="Controller"
            languages={languages}
            onChange={props.onChange}
            disabled={props.disabled} />
    );
};