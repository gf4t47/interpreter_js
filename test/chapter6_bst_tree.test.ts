import {describe, it} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {Element} from "../src/chapter3_pair.ts";
import {addBst, emptyBst, lookupBst} from "../src/chapter6_bst_tree.ts";
import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {listToString} from "../src/chapter3_list.ts";

describe('construct bst', () => {
    let tree = emptyBst;

    const menu: Array<[string, Element]> = [
        ['pizza', 128],
        ['cake', 46],
        ['pasta', 68],
        ['steak', 258],
        ['salad', 1245],
        ['beer', 35],
        ['beer', 36],
        ['beer', 37],
    ]

    menu.forEach(([key, value]: [string, Element]) => {
        it(`Add(${key}, ${value})`, () => {
            tree = addBst(key, value, tree);
            console.info(listToString(tree));
            const found = lookupBst(key, tree);
            assertEquals(found, value);
        })
    });
});
