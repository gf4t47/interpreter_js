import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {Element} from "../src/chapter3_pair.ts";
import {binop, binopE1, binopE2, calc, isBinOp, toInfix, toPrefix, toString} from "../src/chapter5_caculator.ts";
import {assert, assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {each} from "./test_utility.ts";

describe('test binop construction', () => {
    each<[string, Element, Element]>([
            ['+', 1, 2],
            ['*', 12, 22],
            ['-', 121, 122],
            ['/', 5, 78],
        ].reduce((accu, [op, e1, e2]) =>
        ({...accu, [`binop(${op}, ${e1}, ${e2})`]: [op, e1, e2]}), {}),

        ([op, e1, e2]) => {
            const bop = binop(op, e1, e2);
            assert(isBinOp(bop));

            const actual1 = binopE1(bop);
            assertEquals(actual1, e1);

            const actual2 = binopE2(bop);
            assertEquals(actual2, e2);
        }
    )
});

describe('test binop stringtify', () => {
    each<[string, Element, Element, string, string]>(
        [
            ['+', 1, 2, '(1 + 2)', '(+ 1 2)'],
            ['+', binop('-', 1, 1), 2, '((1 - 1) + 2)', '(+ (- 1 1) 2)'],
            ['*', 12, 22, '(12 * 22)', '(* 12 22)'],
            ['*', binop('/', 1, 2), 22, '((1 / 2) * 22)', '(* (/ 1 2) 22)'],
            ['*', binop('/', 1, 2), binop('+', 2, 2), '((1 / 2) * (2 + 2))', '(* (/ 1 2) (+ 2 2))'],
            ['-', 121, 122, '(121 - 122)', '(- 121 122)'],
            ['/', 5, 78, '(5 / 78)', '(/ 5 78)'],
        ].reduce((accu, [op, e1, e2, infix, prefix]) =>
            ({...accu, [`binop(${op}, ${toString(e1)}, ${toString(e2)})`]: [op, e1, e2, infix, prefix]}), {}),
        ([op, e1, e2, expectedInfix, expectedPrefix]) => {
            const bop = binop(op, e1, e2);

            const infix = toInfix(bop);
            assertEquals(infix, expectedInfix);

            const prefix = toPrefix(bop);
            assertEquals(prefix, expectedPrefix);
        }
    );
});

describe('test binop calc', () => {
    each<{'input': [string, Element, Element], 'output': number}>(
        [
            {'input': ['+', 1, 2], 'output': 3},
            {'input': ['+', binop('-', 10, 10), 2], 'output': 2},
            {'input': ['*', 12, 22], 'output': 264},
            {'input': ['*', 12, binop('-', 0, 1)], 'output': -12},
            {'input': ['-', 121, 122], 'output': -1},
            {'input': ['-', 121, binop('*', 11, 11)], 'output': 0},
            {'input': ['/', 10, 2], 'output': 5}
        ].reduce((accu, {'input': [op, e1, e2], output}) =>
            ({...accu, [`binop(${op}, ${toPrefix(e1)}, ${toPrefix(e2)}) => ${output}`]: {'input': [op, e1, e2], output} }), {}),
        ({'input': [op, e1, e2], 'output': expected}) => {
            const bop = binop(op, e1, e2);
            const actual = calc(bop);
            assertEquals(actual, expected);
        }
    )
});
