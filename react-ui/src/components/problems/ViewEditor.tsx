import { makeStyles } from "@material-ui/core";
import { View } from "../../models/View";
import CodeEditor from "./CodeEditor";
import React from "react";

export interface IViewEditorProps {
    value: View;
    onChange(value: View): void;
    disabled: boolean;
}

export default function ViewEditor(props: IViewEditorProps) {

    const languages = [
        { value: "plain_text"   , title: "Plain" },
        { value: "markdown"     , title: "Markdown"},
        { value: "tex"          , title: "TeX"}
    ];

    return (
        <CodeEditor
            value={props.value}
            label="View"
            languages={languages}
            onChange={props.onChange}
            disabled={props.disabled} />
    );
};