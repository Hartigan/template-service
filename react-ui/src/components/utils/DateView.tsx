import React from "react";

export interface IDateViewProps {
    date: Date;
    dateOnly?: boolean;
}

export default function DateView(props: IDateViewProps) {

    const date = new Date(props.date.toString());

    const dateString = props.dateOnly ? date.toLocaleDateString() : date.toLocaleString();

    return <span>{dateString}</span>;
};