import { makeStyles, FormControl, MenuItem, InputLabel, Select } from "@material-ui/core";
import { Code, CodeLanguage, ViewLanguage } from "../../models/Code";
import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-tex";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
        minWidth: 120,
    },
    inputLabel: {
        minWidth: 120,
    },
    selector: {
        maxWidth: 120,
    },
    codeEditor: {
        marginTop: 10,
    },
}));

export interface ICodeLanguage {
    value: CodeLanguage | ViewLanguage;
    title: string;
}

export interface ICodeEditorProps<T extends Code> {
    label: string;
    languages: Array<ICodeLanguage>;
    value: T;
    onChange(value: T): void;
    disabled: boolean;
}

export default function CodeEditor<T extends Code>(props: ICodeEditorProps<T>) {

    const classes = useStyles();

    const langItems = props.languages
        .map(lang => (
            <MenuItem key={lang.value} value={lang.value}>{lang.title}</MenuItem>
        ));

    const updateLanguage = (value: string) => {
        props.onChange({
            language: value,
            content: props.value.content
        } as T);
    };

    const updateContent = (value: string) => {
        props.onChange({
            language: props.value.language,
            content: value
        } as T);
    };

    const languageToMode = (language: CodeLanguage | ViewLanguage) => {
        switch (language) {
            case CodeLanguage.CSharp:
                return "csharp";
            case ViewLanguage.Markdown:
                return "markdown";
            case ViewLanguage.TeX:
                return "tex";
            case ViewLanguage.PlainText:
                return "plain_text";
            default:
                return undefined;
        }
    };

    return (
        <FormControl className={classes.formControl} disabled={props.disabled}>
            <InputLabel
                id="language-label"
                className={classes.inputLabel}>
                Language
            </InputLabel>
            <Select
                labelId="language-label"
                className={classes.selector}
                value={props.value.language}
                disabled={props.disabled}
                onChange={(e) => updateLanguage(e.target.value as string)}>
                {langItems}
            </Select>
            <AceEditor
                className={classes.codeEditor}
                mode={languageToMode(props.value.language)}
                theme="monokai"
                value={props.value.content}
                readOnly={props.disabled}
                minLines={5}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
                }}
                onChange={(value) => updateContent(value)} />
        </FormControl>
    );
};