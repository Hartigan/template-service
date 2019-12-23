import { View } from "./View";
import { Controller } from "./Controller";
import { Validator } from "./Validator";

export interface Problem {
    id: string;
    title: string;
    view: View;
    controller: Controller;
    validator: Validator;
}