import React from "react";
import { Typography } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import 'katex/dist/katex.min.css';
import { InlineTex } from "react-tex";
import { GeneratedViewModel } from "../../models/domain";
import { View } from "../../protobuf/domain_pb";

export interface IProblemViewProps {
    view: GeneratedViewModel;
}

export default function ProblemView(props: IProblemViewProps) {
    switch(props.view.language) {
        case View.Language.MARKDOWN:
            return (
                <div>
                    <ReactMarkdown
                        source={props.view.content}
                        />
                </div>
                
            );
        case View.Language.TEX:
            return (
                <div>
                    <InlineTex
                        texContent={props.view.content}
                        />
                </div>
            );
        case View.Language.PLAIN_TEXT:
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