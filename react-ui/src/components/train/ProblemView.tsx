import React from "react";
import { GeneratedView } from "../../models/GeneratedView";
import { Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";

export interface IProblemViewProps {
    view: GeneratedView;
}

export default function ProblemView(props: IProblemViewProps) {
    switch(props.view.language) {
        case "markdown":
            return (
                <div>
                    <ReactMarkdown
                        source={props.view.content}
                        />
                </div>
                
            );
        case "plain_text":
        default:
            return (
                <div>
                    <Typography variant="body1">
                        {props.view.content}
                    </Typography>
                </div>
            )
    }
};