import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {Pair} from "../src/chapter3_pair.ts";
import {call, func, variable} from "../src/chapter7_constructor.ts";
import {listToString} from "../src/chapter3_list.ts";
import {expToString} from "../src/chapter7_interpreter.ts";
import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {binop} from "../src/chapter5_caculator.ts";

type Exp = Pair;

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
        data.reduce((accu, [expected, exp]) => ({...accu, [`"${listToString(exp)}"`]: [expected, exp]}), {}),
        ([expected, exp]: [string, Exp]) => {
            const actual = expToString(exp);
            assertEquals(actual, expected);
        }
    )
});
