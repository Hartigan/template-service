import { makeStyles, FormControl, MenuItem, InputLabel, Select, TextField } from "@material-ui/core";
import { Code } from "../../models/Code";
import React from "react";

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
    value: string;
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
            <TextField
                className={classes.codeEditor}
                label={props.label}
                multiline
                value={props.value.content}
                disabled={props.disabled}
                rows="5"
                onChange={(e) => updateContent(e.target.value)} />
        </FormControl>
    );
};