import {Element, emptyNode, first, isPair, pair, second} from "./chapter3_pair.ts";
import {AstNode} from "./chapter7_constructor.ts";

const ifExpTypeTag = `ifExp#${Math.random().toString()}`;

export function ifExp(cond: AstNode | boolean, then: Element, alt: Element): AstNode {
    return pair(ifExpTypeTag, pair(cond, pair(then, pair(alt, emptyNode))));
}

export function isIfExp(x: AstNode): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == ifExpTypeTag;
}

export function ifExpCond(x: AstNode): AstNode | boolean {
    if (!isIfExp(x)) {
        throw new Error(`not an if expression: ${x}`);
    }

    return first(second(x));
}

export function ifExpThen(x: AstNode): Element {
    if (!isIfExp(x)) {
        throw new Error(`not an if expression: ${x}`);
    }

    return first(second(second(x)));
}

export function ifExpAlt(x: AstNode): Element {
    if (!isIfExp(x)) {
        throw new Error(`not an if expression: ${x}`);
    }

    return first(second(second(second(x))));
}
