import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {listToString} from "../src/chapter3_list.ts";
import {emptyNode, pair, Pair} from "../src/chapter3_pair.ts";
import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";
import {treeEqual} from "../src/chapter4_tree.ts";

type Tree = Pair;

describe('test treeEqual', () => {
    each<[Tree, Tree, boolean]>([
            [emptyNode, emptyNode, true],
            [pair(1, emptyNode), emptyNode, false],
            [emptyNode, pair(1, emptyNode), false],
            [pair(1, emptyNode), pair(1, emptyNode), true],
            [pair(1, emptyNode), pair(emptyNode, 1), false],
            [pair(pair(1, 1), emptyNode), pair(pair(1, 1), emptyNode), true],
            [pair(pair(1, 1), emptyNode), pair(emptyNode, pair(1, 1)), false],
            [pair(1, emptyNode), pair(2, emptyNode), false],
            [pair(1, pair(2, emptyNode)), pair(1, pair(2, emptyNode)), true],
            [pair(1, pair(2, emptyNode)), pair(1, pair(emptyNode, 2)), false],
            [pair(pair(1, emptyNode), pair(2, emptyNode)), pair(pair(1, emptyNode), pair(2, emptyNode)), true],
            [pair(pair(1, emptyNode), pair(2, emptyNode)), pair(pair(1, 1), pair(2, emptyNode)), false],
            [pair(pair(1, emptyNode), pair(2, emptyNode)), pair(pair(1, pair(2, emptyNode)), pair(2, emptyNode)), false],
            [pair(1, pair(2, emptyNode)), pair(1, pair(3, emptyNode)), false],
            [pair(1, pair(2, emptyNode)), pair(2, pair(1, emptyNode)), false],
        ].reduce((accu, [l1, l2, eq]) => ({...accu, [`${listToString(l1 as Tree)} == ${listToString(l2 as Tree)} => ${eq}`]: [l1, l2, eq]}), {}),

        ([t1, t2, expected]: [Tree, Tree, boolean]) => {
            const actual = treeEqual(t1, t2);
            assertEquals(actual, expected);
        }
    )
});
