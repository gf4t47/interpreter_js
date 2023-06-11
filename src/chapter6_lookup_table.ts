import {emptyNode, Pair, Element, first, second, pair} from "./chapter3_pair.ts";

type Table = Pair;

const _head = first;
const _tail = second;

/**
 * Could assume all table node is a key-value pair
 * @param target
 * @param table
 */
export function lookupTable(target: string, table: Table): Element | null{
    if (table == emptyNode) {
        return null;
    }

    const cur = _head(table);
    const key = _head(cur);
    const value = _tail(cur);

    if (key == target) {
        return value;
    }

    return lookupTable(target, _tail(table));
}

export function addTable(key: string, value: Element, table: Table): Table {
    return pair(pair(key, value), table);
}
