import React from "react";
import { ViewModel } from "../../models/domain";
import { View } from "../../protobuf/domain_pb";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-tex";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";

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
        width: "100%",
        marginTop: 10,
    },
    simpleEditor: {
        marginTop: "16px"
    }
}));

export interface IViewEditorProps {
    value: ViewModel;
    onChange(value: ViewModel): void;
    disabled: boolean;
}

export default function ViewEditor(props: IViewEditorProps) {

    const classes = useStyles();

    const updateLanguage = (value: View.Language) => {
        props.onChange({
            language: value,
            content: props.value.content
        });
    };

    const updateContent = (value: string) => {
        props.onChange({
            language: props.value.language,
            content: value
        });
    };

    const languageToMode = (language: View.Language) => {
        switch (language) {
            case View.Language.MARKDOWN:
                return "markdown";
            case View.Language.TEX:
                return "tex";
            case View.Language.PLAIN_TEXT:
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
                onChange={(e) => updateLanguage(e.target.value as View.Language)}>
                <MenuItem key={View.Language.PLAIN_TEXT} value={View.Language.PLAIN_TEXT}>Plain</MenuItem>
                <MenuItem key={View.Language.MARKDOWN} value={View.Language.MARKDOWN}>Markdown</MenuItem>
                <MenuItem key={View.Language.TEX} value={View.Language.TEX}>Tex</MenuItem>
            </Select>
            <AceEditor
                className={classes.codeEditor}
                style={{ width: "100%" }}
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