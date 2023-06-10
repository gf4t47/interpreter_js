// url_test.ts
import { assertEquals } from 'https://deno.land/std@0.191.0/testing/asserts.ts';
import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {Element, first, pair, second} from "../src/chapter3_pair.ts";
import {each} from "./test_utility.ts";

/***
 * test pair constructor and visitor
 */
describe('test pair constructor and visitor', () => {
    each<[Element, Element]>(
        ([
            [0, 1],
            [1, '1'],
            ['2', 2],
            [3, {}],
            [4, true],
            [false, () => {}],
        ].reduce((accu, [first, second]) =>
                ({...accu, [`(${first}, ${second})`]: [first, second]})
            , {})),

        ([l, r]) => {
            const p = pair(l, r);
            const fst = first(p);
            const snd = second(p);

            assertEquals(fst, l);
            assertEquals(snd, r);
        }
    );
});
