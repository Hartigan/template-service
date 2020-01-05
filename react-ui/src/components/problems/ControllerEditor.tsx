import { Controller } from "../../models/Controller";
import CodeEditor from "./CodeEditor";
import React from "react";

export interface IControllerEditorProps {
    value: Controller;
    onChange(value: Controller): void;
    disabled: boolean;
}

export default function ControllerEditor(props: IControllerEditorProps) {

    const languages = [
        { value: "csharp", title: "C#"}
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