import React from "react";
import { ControllerModel } from "../../models/domain";
import { Controller } from "../../protobuf/domain_pb";
import { FormControl, InputLabel, makeStyles, MenuItem, Select } from "@material-ui/core";
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
        width: "100%",
        marginTop: 10,
    },
    simpleEditor: {
        marginTop: "16px"
    }
}));

export interface IControllerEditorProps {
    value: ControllerModel;
    onChange(value: ControllerModel): void;
    disabled: boolean;
}

export default function ControllerEditor(props: IControllerEditorProps) {

    const classes = useStyles();

    const updateLanguage = (value: Controller.Language) => {
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

    const languageToMode = (language: Controller.Language) => {
        switch (language) {
            case Controller.Language.C_SHARP:
                return "csharp";
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
                onChange={(e) => updateLanguage(e.target.value as Controller.Language)}>
                <MenuItem key={Controller.Language.C_SHARP} value={Controller.Language.C_SHARP}>C#</MenuItem>
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