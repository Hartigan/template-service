import { View } from "./View";
import { Controller } from "./Controller";
import { Validator } from "./Validator";
import { ProblemId } from "./Identificators";

export interface Problem {
    id: ProblemId;
    title: string;
    view: View;
    controller: Controller;
    validator: Validator;
}