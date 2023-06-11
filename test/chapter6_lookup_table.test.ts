import {emptyNode, pair, Pair} from "../src/chapter3_pair.ts";
import {describe} from "https://deno.land/std@0.191.0/testing/bdd.ts";
import {each} from "./test_utility.ts";
import {listToString} from "../src/chapter3_list.ts";
import {lookupTable} from "../src/chapter6_lookup_table.ts";
import {assertEquals} from "https://deno.land/std@0.191.0/testing/asserts.ts";

type Table = Pair;

describe('test construct lookup table', () => {
    each<[Table, string, number]>([
            [emptyNode, 'a', null],
            [pair(pair('a', 1), emptyNode), 'a', 1],
            [pair(pair('a', 1), emptyNode), 'b', null],
            [pair(pair('a', 1), pair(pair('b', 2), emptyNode)), 'a', 1],
            [pair(pair('a', 1), pair(pair('b', 2), emptyNode)), 'b', 2],
            [pair(pair('a', 1), pair(pair('b', 2), emptyNode)), 'c', null],
        ].reduce((accu, [table, key, value]) => ({...accu, [`${listToString(table as Table)}[${key}] => ${value}`]: [table, key, value]}), {}),
        ([table, key, value]: [Table, string, number]) => {
            const actual = lookupTable(key, table);
            assertEquals(actual, value);
        }
    )
});

