import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {AstNode, call, func, variable} from "../src/chapter7_constructor.ts";
import {Element} from "../src/chapter3_pair.ts";
import {ifExp} from "../src/chapter8_branching.ts";
import {binop} from "../src/chapter5_caculator.ts";
import {expToString, interp} from "../src/chapter7_interpreter.ts";
import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";

describe('test raw branching', () => {
    const data: Array<[AstNode, Element]> = [
        [ifExp(true, 'cat', 'dog'), 'cat'],
        [ifExp(false, 'cat', 'dog'), 'dog'],
        [ifExp(binop('=', 1, 1), 'cat', 'dog'), 'cat'],
        [ifExp(binop('=', 1, 2), 'cat', 'dog'), 'dog'],
        [ifExp(binop('>', 1, 2), 'cat', 'dog'), 'dog'],
        [ifExp(binop('<', 1, 2), 'cat', 'dog'), 'cat'],

        [ifExp(true, 1, 2), 1],
        [ifExp(false, 1, 2), 2],
        [ifExp(false, binop('+', 1, 1), binop('-', 1, 1)), 0],
        [ifExp(binop('=', 1, 1), call(func('x', binop('*', variable('x'), 1)), 11), call(func('x', binop('*', variable('x'), 1)), 22)), 11],
    ];

    each<[AstNode, Element]>(
        data.reduce((accu, [exp, expected]) => ({...accu, [`${expToString(exp)} => ${expected}`]: [exp, expected]}), {}),
        ([exp, expected]: [AstNode, Element]) => {
            const actual = interp(exp);
            assertEquals(actual, expected);
        }
    )
});

describe('test call branching', () => {
    const data: Array<[AstNode, Element]> = [
        [call(func('f', ifExp(call(variable('f'), 12), 'cat', 'dog')), func('x', binop('>', variable('x'), 7))), 'cat'],
        [call(func('f', ifExp(call(variable('f'), 5), 'cat', 'dog')), func('x', binop('>', variable('x'), 7))), 'dog']
    ];

    each<[AstNode, Element]>(
        data.reduce((accu, [exp, expected]) => ({...accu, [`${expToString(exp)} => ${expected}`]: [exp, expected]}), {}),
        ([exp, expected]: [AstNode, Element]) => {
            const actual = interp(exp);
            assertEquals(actual, expected);
        }
    )
});

describe('test |abs|', () => {
    const absExp = func('x', ifExp(binop('>', variable('x'), 0), variable('x'), binop('-', 0, variable('x'))));
    assertEquals(interp(call(absExp, 5)), 5);
    assertEquals(interp(call(absExp, -5)), 5);
    assertEquals(interp(call(absExp, -7)), 7);
    assertEquals(interp(call(absExp, 0)), 0);
});