import { Code } from "./Code";

export interface GeneratedView extends Code {
    language: "markdown" | "plain_text";
}