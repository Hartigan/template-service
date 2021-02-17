import React from "react";
import { ValidatorModel } from "../../models/domain";
import { Validator } from "../../protobuf/domain_pb";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-tex";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import { makeStyles, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import FloatValidatorEditor from "./FloatValidatorEditor";
import IntegerValidatorEditor from "./IntegerValidatorEditor";
import StringValidatorEditor from "./StringValidatorEditor";

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

export interface IValidatorEditorProps {
    value: ValidatorModel;
    onChange(value: ValidatorModel): void;
    disabled: boolean;
}

export default function ValidatorEditor(props: IValidatorEditorProps) {

    const classes = useStyles();

    const updateLanguage = (value: Validator.Language) => {
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

    const getEditor = () => {
        switch (props.value.language) {
            case Validator.Language.C_SHARP:
                return (
                    <AceEditor
                        className={classes.codeEditor}
                        style={{ width: "100%" }}
                        mode={"csharp"}
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
                );
            case Validator.Language.FLOAT_VALIDATOR:
                return (
                    <FloatValidatorEditor
                        className={classes.simpleEditor}
                        value={props.value.content}
                        onChange={updateContent}
                        disabled={props.disabled}
                        />
                );
            case Validator.Language.INTEGER_VALIDATOR:
                return (
                    <IntegerValidatorEditor
                        className={classes.simpleEditor}
                        value={props.value.content}
                        onChange={updateContent}
                        disabled={props.disabled}
                        />
                );
            case Validator.Language.STRING_VALIDATOR:
                return (
                    <StringValidatorEditor
                        className={classes.simpleEditor}
                        value={props.value.content}
                        onChange={updateContent}
                        disabled={props.disabled}
                        />
                );
        }
    }

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
                onChange={(e) => updateLanguage(e.target.value as Validator.Language)}>
                <MenuItem key={Validator.Language.C_SHARP} value={Validator.Language.C_SHARP}>C#</MenuItem>
                <MenuItem key={Validator.Language.INTEGER_VALIDATOR} value={Validator.Language.INTEGER_VALIDATOR}>Integer validator</MenuItem>
                <MenuItem key={Validator.Language.FLOAT_VALIDATOR} value={Validator.Language.FLOAT_VALIDATOR}>Float validator</MenuItem>
                <MenuItem key={Validator.Language.STRING_VALIDATOR} value={Validator.Language.STRING_VALIDATOR}>String validator</MenuItem>
            </Select>
            {getEditor()}
        </FormControl>
    );
};