import { TextField, StandardTextFieldProps, FilledTextFieldProps, OutlinedTextFieldProps } from "@material-ui/core";
import React, { useEffect } from "react";
import { Subject, timer } from "rxjs";
import { debounce } from 'rxjs/operators';

export interface SearchStandardTextFieldProps extends StandardTextFieldProps {
    onSearch: (value: string) => void;
}

export interface SearchFilledTextFieldProps extends FilledTextFieldProps {
    onSearch: (value: string) => void;
}

export interface SearchOutlinedTextFieldProps extends OutlinedTextFieldProps {
    onSearch: (value: string) => void;
}

export type SearchFieldProps = SearchStandardTextFieldProps | SearchFilledTextFieldProps | SearchOutlinedTextFieldProps;

export default function SearchField(props: SearchFieldProps) {

    const subject = new Subject<string>();

    const newProps = { ...props };
    delete newProps.onSearch;
    
    useEffect(() => {
        const sub = 
            subject
                .pipe(debounce(() => timer(1000)))
                .subscribe(props.onSearch);
        return () => {
            sub.unsubscribe();
        };
    })


    const onUpdate = (value: string) => {
        subject.next(value);
    };

    return (
        <TextField
            {...newProps}
            onChange={(e) => onUpdate(e.target.value)}
            />
    );
};