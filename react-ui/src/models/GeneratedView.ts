import { Code, ViewLanguage } from "./Code";

export interface GeneratedView extends Code {
    language: ViewLanguage;
}