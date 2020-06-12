import { View } from "../../models/View";
import CodeEditor from "./CodeEditor";
import React from "react";
import { ViewLanguage } from "../../models/Code";

export interface IViewEditorProps {
    value: View;
    onChange(value: View): void;
    disabled: boolean;
}

export default function ViewEditor(props: IViewEditorProps) {

    const languages = [
        { value: ViewLanguage.PlainText   , title: "Plain" },
        { value: ViewLanguage.Markdown    , title: "Markdown"},
        { value: ViewLanguage.TeX         , title: "TeX"}
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