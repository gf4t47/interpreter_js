import {emptyNode, first, isPair, Pair, second} from "./chapter3_pair.ts";

const _left = first;
const _right = second;

type Tree = Pair;

export function treeEqual(t1: Tree, t2: Tree): boolean {
    if (!isPair(t1) && !isPair(t2)) {
        return t1 == t2;
    }

    if (isPair(t1) && isPair(t2)) {
        return treeEqual(_left(t1), _left(t2)) && treeEqual(_right(t1), _right(t2));
    }

    return false;
}

export function treeSum(t: Tree): number {
    if (!isPair(t)) {
        return t == emptyNode ? 0 : Number(t);
    }

    return treeSum(_left(t)) + treeSum(_right(t));
}
