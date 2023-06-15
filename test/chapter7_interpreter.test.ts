import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {call, func, variable} from "../src/chapter7_constructor.ts";
import {Exp, Env, expToString, interp, extEnv, emptyEnv} from "../src/chapter7_interpreter.ts";
import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {binop} from "../src/chapter5_caculator.ts";

describe('test expression to string', () => {
    const data: Array<[string, Exp]> = [
        ['x', variable('x')],
        ['x => x', func('x', variable('x'))],
        ['x => (1 + (x * 2))', func("x", binop("+", 1, binop("*", variable("x"), 2)))],
        ['f(2)', call(variable('f'), 2)],
        ['f(g(2))', call(variable('f'), call(variable('g'), 2))],
        ['(x => x)(2)', call(func('x', variable('x')), 2)],
        ['(x => x => x)(2)', call(func('x', func('x', variable('x'))), 2)],
        ['(x => y => (x + y))(2)(3)', call(call(func('x', func('y', binop('+', variable('x'), variable('y')))), 2), 3)],
    ];

    each<[string, Exp]>(
        data.reduce((accu, [expected, exp]) => ({...accu, [expected]: [expected, exp]}), {}),
        ([expected, exp]: [string, Exp]) => {
            const actual = expToString(exp);
            assertEquals(actual, expected);
        }
    )
});

describe('test expression to evaluate', () => {
    const data: Array<[number | string, Exp | number | string, Env]> = [
        [2, 2, emptyEnv],
        ['literal string', 'literal string', emptyEnv],
        [2, binop('+', 1, 1), emptyEnv],
        [-1, binop('-', 2, '3'), emptyEnv],
        [11, binop('+', 1, binop('*', 1, '10')), emptyEnv],
        [2, variable('x'), extEnv('x', 2, emptyEnv)],
        ['literal string', variable('x'), extEnv('x', 'literal string', emptyEnv)],
        [2, binop('+', 1, variable('x')), extEnv('x', 1, emptyEnv)],
        [7, binop('+', 1, binop('*', variable('x'), variable('y'))), extEnv('y', 3, extEnv('x', 2, emptyEnv))],
    ];

    each<[number | string, Exp | number | string, Env]>(
        data.reduce((accu, [expected, exp, env]) => ({...accu, [`${expToString(exp)} => ${expected}`]: [expected, exp, env]}), {}),
        ([expected, exp, env]: [number | string, Exp | number | string, Env]) => {
            const actual = interp(exp, env);
            assertEquals(actual, expected);
        }
    );
});
