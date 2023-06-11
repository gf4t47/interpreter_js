import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {isVariable, variable, variableName} from "../src/chapter7_interperter.ts";
import {assert, assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";

describe('test construct variable', () => {
    each<string>(
        [
            null,
            '',
            'name',
            "longlonglong name"
        ].reduce((accu, input) => ({...accu, [`"${input}"`]: input}), {}),
        (input: string) => {
            const varNode = variable(input);
            assert(isVariable(varNode));

            const varName = variableName(varNode);
            assertEquals(varName, input);
        }
    )
});