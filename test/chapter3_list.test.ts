import {each} from "./test_utility.ts";
import {pair} from "../src/chapter3_pair.ts";
import {Element} from "../src/chapter3_pair.ts";
import {List, listToString, length, append, nth} from "../src/chapter3_list.ts";

import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";


/***
 * test length(list)
 */
describe('test length(list)', () => {
    each<[List, number]>(
        ([
            [null, 0],
            [pair(2, pair(3, null)), 2],
            [pair(4, pair(5, pair(6, null))), 3],
            [pair(2, pair(pair(3, 4), null)), 2],
        ].reduce((accu, [ls, len]) =>
                ({...accu, [`${listToString(ls as List)} => ${len}`]: [ls, len]})
            , {})),

        ([ls, len]: [List, number]) => {
            const actual = length(ls);
            assertEquals(actual, len);
        }
    );
});


/***
 * test append(list1, list2)
 */
describe('test append(list1, list2)', () => {
    each<[List, List, List]>(
        [
            [null, null, null],
            [pair(1, null), null, pair(1, null)],
            [null, pair(1, null), pair(1, null)],
            [pair(1, null), pair(2, null), pair(1, pair(2, null))],
            [pair(1, pair(2, null)), pair(3, null), pair(1, pair(2, pair(3, null)))],
            [pair(1, null), pair(2, pair(3, null)), pair(1, pair(2, pair(3, null)))],
        ].reduce((accu, [l1, l2, l]) =>
                ({...accu, [`${listToString(l1)} + ${listToString(l2)} => ${listToString(l)}`]: [l1, l2, l]})
            , {}),
        ([l1, l2, l]: [List, List, List]) => {
            const actual = append(l1, l2);
            assertEquals(length(actual), length(l));
        }
    );
});


/***
 * test nth(list, n)
 */
describe('test nth(list, n)', () => {
    each<[List, number, Element]>([
            [pair(2, null), 0, 2],
            [pair(1, pair(2, pair(3, pair(4, null)))), 2, 3]
        ].reduce((accu, [ls, n, e]) => ({...accu, [`${listToString(ls as List)}[${n}] => ${e}`]: [ls, n, e]}), {}),

        ([ls, n, e]: [List, number, Element]) => {
            const actual = nth(ls, n);
            assertEquals(actual, e);
        }
    )
});
