import {Pair, Element, pair, isPair, first, second, emptyNode} from "./chapter3_pair.ts";

type Tree = Pair;

const typeTag = `bst#${Math.random().toString()}`;
export const emptyBst = emptyNode;

export function bst(key: string, value: Element, left: Tree, right: Tree): Tree {
    return pair(typeTag, pair(pair(key, value), pair(left, right)));
}

export function isBst(x: Element): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == typeTag;
}

export function bstKey(x: Tree): string {
    return first(first(second(x)));
}

export function bstValue(x: Tree): Element {
    return second(first(second(x)));
}

export function bstLeft(x: Tree): Tree {
    return first(second(second(x)));
}

export function bstRight(x: Tree): Tree {
    return second(second(second(x)));
}

export function addBst(key: string, value: Element, x: Tree): Tree {
    if (!isBst(x)) {
        return bst(key, value, emptyBst, emptyBst);
    }

    const curKey = bstKey(x);
    if (key == curKey) {
        return bst(key, value, addBst(curKey, bstValue(x), bstLeft(x)), bstRight(x));
    }

    if (key < curKey) {
        // console.info(`addLeft: ${key} < ${curKey}`)
        return bst(key, value, bstLeft(x), addBst(curKey, bstValue(x), bstRight(x)));

    }

    // console.info(`addRight: ${key} > ${curKey}`)
    return bst(key, value, addBst(curKey, bstValue(x), bstLeft(x)), bstRight(x));
}

export function lookupBst(key: string, tree: Tree): Element | null {
    if (!isBst(tree)) {
        return null;
    }

    const curKey = bstKey(tree);
    if (key == curKey) {
        return bstValue(tree);
    }

    if (key < curKey) {
        return lookupBst(key, bstLeft(tree));
    }

    return lookupBst(key, bstRight(tree));
}