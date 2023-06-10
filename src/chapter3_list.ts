import {first, pair, Pair, pairToString, second, Element} from "./chapter3_pair.ts";

export type List = Pair | null;

const _head = first;
const _tail = second;

const emptyList = null;

export function listToString(ls: List) {
    if (ls == emptyList) {
        return `[${emptyList}]`;
    }
    else {
        return `[${pairToString(ls)}]`;
    }
}

export function length(ls: List): number {
    if (ls == null) {
        return 0;
    }
    else {
        return 1 + length(_tail(ls));
    }
}

export function append(l1: List, l2: List): List {
    if (l1 == null) {
        return l2;
    }
    else {
        return pair(_head(l1), append(_tail(l1), l2));
    }
}

export function nth(ls: List, n: number): Element {
    if (ls == null) {
        throw new Error(`Index out of bound: ${n}`);
    }
    else if (n == 0) {
        return _head(ls);
    }
    else {
        return nth(_tail(ls), n - 1);
    }
}
