import React from "react";

export interface IDateViewProps {
    date: Date;
}

export default function DateView(props: IDateViewProps) {
    return <span>{new Date(props.date.toString()).toLocaleString()}</span>;
};