// url_test.ts
import { assertEquals } from 'https://deno.land/std@0.191.0/testing/asserts.ts';
import {fact, fib} from "../src/chapter2_recursion.ts";
import { each } from "./test_utility.ts";

each<[number, number]>(
    ([
        [0, 1],
        [1, 1],
        [2, 2],
        [3, 6],
        [4, 24],
        [5, 120],
    ].reduce((accu, [input, expected]) =>
            ({...accu, [`${input}! => ${expected}`]: [input, expected]})
        , {})),

    ([input, expected]) => {
        const actual = fact(input);
        assertEquals(actual, expected);
    }
);

each<[number, number]>(
    ([
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 5],
        [6, 8],
        [7, 13],
        [8, 21],
    ].reduce((accu, [input, expected]) =>
            ({...accu, [`fib(${input}) => ${expected}`]: [input, expected]})
        , {})),

    ([input, expected]) => {
        const actual = fib(input);
        assertEquals(actual, expected);
    }
);
