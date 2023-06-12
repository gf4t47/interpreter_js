import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {
    func,
    funcBody,
    funcParameter,
    isFunc,
    isVariable,
    variable,
    variableName
} from "../src/chapter7_interperter.ts";
import {assert, assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {Pair} from "../src/chapter3_pair.ts";
import {binop} from "../src/chapter5_caculator.ts";
import {bo} from "https://dev.jspm.io/npm:mathjs@11.2.1/_/7f11f7ed.js";
import {listEqual} from "../src/chapter3_list.ts";
import {treeEqual} from "../src/chapter4_tree.ts";

type AstNode = Pair;

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

describe('test construct func', () => {
    const funcData: Array<[string, AstNode]> = [
        ['x', variable('x')],
        ['x + x', binop('+', 2, 1)],
        ['x', binop('+', variable('x'), variable('x'))]
    ]
    each<[string, AstNode]>(
        funcData.reduce((accu, [para, body]) => ({...accu, [`func(${para})`]: [para, body]}), {}),
        ([para, body]: [string, AstNode]) => {
            const funcNode = func(para, body);
            assert(isFunc(funcNode));

            const fPara = funcParameter(funcNode);
            const fBody = funcBody(funcNode);

            assertEquals(fPara, para);
            assert(treeEqual(fBody, body));
        }
    )
});

