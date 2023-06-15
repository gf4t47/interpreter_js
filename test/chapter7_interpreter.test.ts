import {describe, it} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {call, func, variable} from "../src/chapter7_constructor.ts";
import {Exp, Env, expToString, interpret, extEnv, emptyEnv, interp} from "../src/chapter7_interpreter.ts";
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
        [6, call(func('x', variable('x')), 6), emptyEnv],
        [7, call(func('x', binop('+', variable('x'), 1)), 6), emptyEnv],
        [9, call(func('x', binop('*', variable('x'), variable('x'))), 3), emptyEnv],
        [8, call(func('x', binop('+', variable('x'), variable('y'))), 6), extEnv('y', 2, emptyEnv)],
        [4, call(call(func('x', func('y', binop('-', variable('x'), variable('y')))), 6 /* x */), 2 /* x */), extEnv('z'/*not used*/, 111, emptyEnv)],
    ];

    each<[number | string, Exp | number | string, Env]>(
        data.reduce((accu, [expected, exp, env]) => ({...accu, [`${expToString(exp)} => ${expected}`]: [expected, exp, env]}), {}),
        ([expected, exp, env]: [number | string, Exp | number | string, Env]) => {
            const actual = interpret(exp, env);
            assertEquals(actual, expected);
        }
    );

    it('test curriedAdd', () => {
        // x => y => x + y
        const curriedAdd = func("x", func("y", binop("+", variable("x"), variable("y"))));
        // (x => y => x + y)(2)(3) => 5
        assertEquals(interp(call(call(curriedAdd, 2), 3)), 5);


    });

    it('test apply call', () => {
        const square = func("x", binop("*", variable("x"), variable("x")));
        // f => x => f(x)
        const applyFun =  func("f", func("x", call(variable("f"), variable("x"))));
        // apply(square)(3) => 9
        assertEquals(interp(call(call(applyFun, square), 3)), 9);
    });

    it('test compose call', () => {
        // f => g => x => f(g(x))
        const composeFun = func("f", func("g", func("x", call(variable("f"), call(variable("g"), variable("x"))))));
        const add1 = func("x", binop("+", variable("x"), 1));
        const square = func("x", binop("*", variable("x"), variable("x")));

        const composed1 = call(call(composeFun, square), add1);
        // compose(add1)(square)(3) => 16
        assertEquals(interp(call(composed1, 3)), 16);

        const composed2 = call(call(composeFun, add1), square);
        // compose(square)(add1)(3) => 10
        assertEquals(interp(call(composed2, 3)), 10);

        const composed3 = call(call(call(composeFun, add1), square), 3);
        // compose(square)(add1)(3) => 10
        assertEquals(interp(composed3), 10);
    });
});
