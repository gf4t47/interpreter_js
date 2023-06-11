import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {Element} from "../src/chapter3_pair.ts";
import {binop, binopE1, binopE2, isBinOp, toInfix, toPrefix, toString} from "../src/chapter5_caculator.ts";
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
