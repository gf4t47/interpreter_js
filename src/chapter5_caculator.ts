import {emptyNode, first, Pair, pair, second, Element, isPair} from "./chapter3_pair.ts";

type BinOp = Pair;
const typeTag = `binOp#${Math.random().toString()}`;

const calcOp: Record<string, (a: number, b: number) => number> = {
    '+': (x: number, y: number) => x + y,
    '-': (x: number, y: number) => x - y,
    '*': (x: number, y: number) => x * y,
    '/': (x: number, y: number) => x / y,
}

export function binop(op: string, e1: Element, e2: Element): BinOp
{
    return pair(typeTag, pair(op, pair(e1, pair(e2, emptyNode))));
}

export function isBinOp(x: Element): boolean {
    if (!isPair(x)) {
        return false;
    }

    return first(x) == typeTag;
}

export function binopOp(x: BinOp): string {
    return first(second(x));
}

export function binopE1(x: BinOp): Element {
    return first(second(second(x)));
}

export function binopE2(x: BinOp): Element {
    return first(second(second(second(x))));
}

export function toInfix(x: Element): string {
    if (!isBinOp(x)) {
        return String(x);
    }

    const op = binopOp(x);
    const e1 = binopE1(x);
    const e2 = binopE2(x);
    return `(${toInfix(e1)} ${op} ${toInfix(e2)})`;
}

export function toPrefix(x: Element): string {
    if (!isBinOp(x)) {
        return String(x);
    }

    const op = binopOp(x);
    const e1 = binopE1(x);
    const e2 = binopE2(x);
    return `(${op} ${toPrefix(e1)} ${toPrefix(e2)})`;
}

export function toString(x: Element): string {
    if (!isBinOp(x)) {
        return String(x);
    }

    const op = binopOp(x);
    const e1 = binopE1(x);
    const e2 = binopE2(x);

    return `binop(${op}, ${toString(e1)}, ${toString(e2)})`;
}

export function calc(t: BinOp): number {
    if (!isBinOp(t)) {
        return Number(t);
    }

    const op = binopOp(t);
    const e1 = binopE1(t);
    const e2 = binopE2(t);

    const n1 = calc(e1);
    const n2 = calc(e2);

    return calcOp[op](n1, n2);
}
