import React from "react";

export interface ITimeSpanViewProps {
    fromDate: Date;
    toDate: Date;
}

export default function TimeSpanView(props: ITimeSpanViewProps) {

    const castDate = (date: Date) => {
        return new Date(date.toString());
    };

    const addLeadingZeros = (t: number) => {
        if (t < 10) {
            return "0" + t.toString();
        } else {
            return t.toString();
        }
    };

    const fromDate = castDate(props.fromDate);
    const toDate = castDate(props.toDate);

    const diff = Math.floor((toDate.getTime() - fromDate.getTime()) / 1000);
    const seconds = diff % 60;
    const minutes = Math.floor(diff / 60) % 60;
    const hours = Math.floor(diff / 3600);

    return <span>{hours}:{addLeadingZeros(minutes)}:{addLeadingZeros(seconds)}</span>;
};