// url_test.ts
import { assertEquals } from 'https://deno.land/std@0.191.0/testing/asserts.ts';
import {element, first, pair, second} from "../src/chapter3_list.ts";
import {each} from "./test_utility.ts";

each<[element, element]>(
    ([
        [0, 1],
        [1, '1'],
        ['2', 2],
        [3, {}],
        [4, true],
        [false, 120],
    ].reduce((accu, [input, expected]) =>
        ({...accu, [`(${input}, ${expected})`]: [input, expected]})
    , {})),

    ([l, r]) => {
        const p = pair(l, r);
        const fst = first(p);
        const snd = second(p);

        assertEquals(fst, l);
        assertEquals(snd, r);
    }
);
